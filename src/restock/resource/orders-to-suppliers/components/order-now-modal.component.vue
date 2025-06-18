<script> import BaseModal from "../../../../shared/components/base-modal.component.vue"
import Select from "primevue/select"
import Button from "primevue/button"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Checkbox from "primevue/checkbox"
import OrderDetailsModalComponent from "./order-details-modal.component.vue";
import {SupplyService} from "../../inventory/services/supply.service"
import {SupplyAssembler} from "../../inventory/services/supply.assembler"
import {SupplyBatchService} from "../../inventory/services/supply-batch.service.js"
import {UserService} from "../../../iam/services/user.service"
import {ProfileService} from "../../../profiles/services/profile.service"
import {UserAssembler} from "../../../iam/services/user.assembler"
import {ProfileAssembler} from "../../../profiles/services/profile.assembler"

export default {
  name: "OrderNowModal",
  components: {
    OrderDetailsModalComponent,
    BaseModal,
    "pv-select": Select,
    "pv-button": Button,
    "pv-data-table": DataTable,
    "pv-column": Column,
    "pv-checkbox": Checkbox
  },
  props: {modelValue: Boolean},
  emits: ["update:modelValue", "close"],
  data() {
    return {
      step: 1,
      selectedSupply: null,
      allSupplies: [],
      allBatches: [],
      filteredBatches: [],
      selectedBatchIds: [],
      supplierProfiles: [],
      showConfirmModal: false
    }
  },
  computed: {
    selectedBatches() {
      return this.filteredBatches.filter(b => this.selectedBatchIds.includes(b.id))
    }
  },
  watch: {
    modelValue(val) {
      if (val) this.resetModal()
    }
  },
  async mounted() {
    await this.loadInitialData()
  },
  methods: {
    async loadInitialData() {
      try {
        const [suppliesRes, batchesRes, usersRes, profilesRes] = await Promise.all([new SupplyService().getAll(), new SupplyBatchService().getAll(), new UserService().getAll(), new ProfileService().getAll()])
        this.allSupplies = SupplyAssembler.toEntitiesFromResponse(suppliesRes)
        this.allBatches = batchesRes.data
        const users = UserAssembler.toEntitiesFromResponse(usersRes)
        const profiles = ProfileAssembler.toEntitiesFromResponse(profilesRes)
        this.supplierProfiles = users.map(user => {
          const profile = profiles.find(p => p.userId === user.id)
          return {id: user.id, name: profile?.name || user.email, company: profile?.companyName || ''}
        })
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
      }
    }, onSupplySelect() {
      if (!this.selectedSupply?.id) {
        this.filteredBatches = []
        return
      }
      const {id: supplyId, price, name, userId} = this.selectedSupply
      this.filteredBatches = this.allBatches.filter(batch => batch.supply_id === supplyId).map(batch => ({
        ...batch,
        price: price ?? 0,
        supplyName: name ?? '',
        supplierId: batch.user_id ?? userId
      }))
    }, getSupplierName(userId) {
      const profile = this.supplierProfiles.find(p => p.id === userId)
      return profile?.name || "Proveedor desconocido"
    }, nextStep() {
      if (this.selectedBatches.length === 0) {
        this.$toast.add({severity: "warn", summary: "Advertencia", detail: "Selecciona al menos un batch", life: 3000})
        return
      }
      this.showConfirmModal = true
    }, closeModal() {
      this.$emit("update:modelValue", false)
      this.$emit("close")
    }, resetModal() {
      this.step = 1
      this.selectedSupply = null
      this.filteredBatches = []
      this.selectedBatchIds = []
    }, handleFinalConfirmation(data) {
      console.log("Confirmado:", data)
      this.closeModal()
    }
  }
}
</script>

<template>
  <base-modal :model-value="modelValue" title="Create New Order" @close="closeModal">
    <template #default>
      <div class="modal-step"><label>Selecciona un insumo:</label>
        <pv-select v-model="selectedSupply" :options="allSupplies" optionLabel="name" placeholder="Select supply"
                   @change="onSupplySelect"/>
        <div v-if="filteredBatches.length">
          <h4>Batches disponibles para: {{ selectedSupply.name }}</h4>
          <pv-data-table :value="filteredBatches">
            <pv-column field="id" header="ID"/>
            <pv-column field="expiration_date" header="Caducidad"/>
            <pv-column field="stock" header="Stock"/>
            <pv-column header="Proveedor">
              <template #body="slotProps">
                {{ getSupplierName(slotProps.data.supplierId) }}
              </template>
            </pv-column>
            <pv-column header="Seleccionar">
              <template #body="slotProps">
                <pv-checkbox :value="slotProps.data.id" v-model="selectedBatchIds"/>
              </template>
            </pv-column>
          </pv-data-table>
        </div>
      </div>
    </template>

    <template #footer>
      <pv-button label="Cancelar" class="btn-cancel" @click="closeModal"/>
      <pv-button
          label="Siguiente"
          class="btn-next"
          :disabled="!selectedBatchIds.length"
          @click="nextStep"
      />
    </template>
  </base-modal>
  <order-details-modal-component
      v-model="showConfirmModal"
      :supply="selectedSupply"
      :selected-batches="selectedBatches"
      @submitted="handleFinalConfirmation"
  />
</template>

<style scoped> .modal-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-cancel {
  background-color: #d9534f;
  color: white;
}

.btn-next {
  background-color: #f28c38;
  color: white;
}
</style>