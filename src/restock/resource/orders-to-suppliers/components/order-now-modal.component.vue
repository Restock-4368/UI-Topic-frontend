<script>
import BaseModal from '../../../../shared/components/base-modal.component.vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PlaceOrderModalComponent from './place-order-modal.component.vue';
import {SupplyService} from '../../inventory/services/supply.service';
import {SupplyAssembler} from '../../inventory/services/supply.assembler';
import {SupplyBatchService} from '../../inventory/services/supply-batch.service';
import {UserService} from '../../../iam/services/user.service';
import {ProfileService} from '../../../profiles/services/profile.service';
import {UserAssembler} from '../../../iam/services/user.assembler';
import {ProfileAssembler} from '../../../profiles/services/profile.assembler';
import {OrderToSupplierService} from '../services/order-to-supplier.service';
import {OrderToSupplierBatchService} from '../services/order-to-supplier-batch.service';

export default {
  name: 'OrderNowModal',
  components: {
    BaseModal,
    OrderDetailsModalComponent: PlaceOrderModalComponent,
    'pv-button': Button,
    'pv-select': Select,
    'pv-input-text': InputText,
    'pv-checkbox': Checkbox,
    'pv-data-table': DataTable,
    'pv-column': Column
  },
  props: {modelValue: Boolean},
  emits: ['update:modelValue', 'close'],
  data() {
    return {
      step: 1,
      selectedSupply: null,
      allSupplies: [],
      confirmedBatches: [],
      allBatches: [],
      supplierProfiles: [],
      selectedBatchIds: [],
      filteredBatches: [],
      fullOrder: [],
      showConfirmModal: false,
      batchQuantities: {}
    };
  },
  computed: {
    selectedBatches() {
      return this.filteredBatches.filter(b => this.selectedBatchIds.includes(b.batch.id));
    },
    allSelectedBatches() {
      return this.fullOrder.filter(entry => this.selectedBatchIds.includes(entry.batch.id));
    }
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      const [suppliesRes, batchesRes, usersRes, profilesRes] = await Promise.all([
        new SupplyService().getAll(),
        new SupplyBatchService().getAll(),
        new UserService().getAll(),
        new ProfileService().getAll()
      ]);

      this.allSupplies = SupplyAssembler.toEntitiesFromResponse(suppliesRes);
      this.allBatches = batchesRes.data;

      const users = UserAssembler.toEntitiesFromResponse(usersRes);
      const profiles = ProfileAssembler.toEntitiesFromResponse(profilesRes);

      this.supplierProfiles = users.map(user => {
        const profile = profiles.find(p => p.userId === user.id);
        return {
          id: user.id,
          name: profile?.name || user.email,
          company: profile?.companyName || ''
        };
      });
    },
    resetModal() {
      this.step = 1;
      this.selectedSupply = null;
      this.selectedBatchIds = [];
      this.filteredBatches = [];
      this.fullOrder = [];
      this.showConfirmModal = false;
      this.batchQuantities = {};
    },
    onSupplySelect() {
      if (!this.selectedSupply?.id) {
        this.filteredBatches = [];
        return;
      }

      const { id: supplyId, userId } = this.selectedSupply;

      this.filteredBatches = this.allBatches
          .filter(batch => batch.supply_id === supplyId)
          .map(batch => {
            const supplier = this.supplierProfiles.find(p => p.id === (batch.supplier_id ?? userId)) || {
              name: 'Desconocido',
              id: 0
            };

            const entry = {
              batch,
              supply: this.selectedSupply,
              supplier
            };

            // Si el batch está confirmado, asegúrate que siga seleccionado
            if (this.confirmedBatches.some(cb => cb.batch.id === batch.id) &&
                !this.selectedBatchIds.includes(batch.id)) {
              this.selectedBatchIds.push(batch.id);
            }

            return entry;
          });
    },
    toggleBatchSelection(batchId, entry) {
      const index = this.selectedBatchIds.indexOf(batchId);
      if (index > -1) {
        this.selectedBatchIds.splice(index, 1);
        this.fullOrder = this.fullOrder.filter(e => e.batch.id !== batchId);
      } else {
        this.selectedBatchIds.push(batchId);
        this.fullOrder.push(entry);
      }
    },
    nextStep() {
      if (!this.confirmedBatches) this.confirmedBatches = [];

      this.selectedBatchIds.forEach(batchId => {
        const entry = this.filteredBatches.find(b => b.batch.id === batchId);
        if (entry && !this.confirmedBatches.some(cb => cb.batch.id === batchId)) {
          this.confirmedBatches.push(entry);
        }
      });

      console.log('🧪 [nextStep] confirmedBatches:', this.confirmedBatches);

      this.step = 2;
      this.showConfirmModal = true;
    },
    goBackFromDetails() {
      this.step = 1;
      this.showConfirmModal = false;
    },
    closeModal() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    async handleFinalConfirmation({batches, quantities}) {
      try {
        const orderService = new OrderToSupplierService();
        const batchService = new OrderToSupplierBatchService();

        const grouped = batches.reduce((acc, entry) => {
          const supplierId = entry.supplier.id;
          if (!acc[supplierId]) acc[supplierId] = [];
          acc[supplierId].push(entry);
          return acc;
        }, {});

        for (const [supplierId, entries] of Object.entries(grouped)) {
          const now = new Date();

          const orderPayload = {
            date: now.toISOString(),
            estimated_ship_date: null,
            estimated_ship_time: null,
            description: `Order for ${entries[0]?.supply?.name || 'supplies'}`,
            admin_restaurant_id: 4,
            supplier_id: Number(supplierId),
            order_to_supplier_state_id: 1,
            order_to_supplier_situation_id: 1,
            requested_products_count: entries.length,
            total_price: entries.reduce((sum, e) => (sum + (quantities[e.batch.id] || 0) * (e.supply.price || 0)), 0),
            partially_accepted: false
          };

          const orderRes = await orderService.create(orderPayload);
          const orderId = orderRes?.id || orderRes?.data?.id;

          for (const entry of entries) {
            const qty = quantities[entry.batch.id] || 0;
            if (qty <= 0) continue;

            await batchService.create({
              order_to_supplier_id: orderId,
              batch_id: entry.batch.id,
              quantity: qty,
              accepted: false
            });
          }
        }

        this.$toast?.add?.({
          severity: 'success',
          summary: 'Orden creada',
          detail: 'La orden ha sido registrada correctamente.',
          life: 3000
        });

        this.resetModal();
        this.closeModal();
        this.showConfirmModal = false;
      } catch (err) {
        console.error('❌ Error al crear la orden:', err);
        this.$toast?.add?.({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la orden.',
          life: 4000
        });
      }
    }
  }
};
</script>

<template>
  <base-modal :model-value="modelValue" title="Crear orden de compra" @close="closeModal">
    <template #default>
      <div class="modal-step">
        <label>Selecciona un insumo:</label>
        <pv-select
            v-model="selectedSupply"
            :options="allSupplies"
            optionLabel="name"
            placeholder="Selecciona un insumo"
            @change="onSupplySelect"
        />

        <div v-if="filteredBatches.length">
          <h4>Batches disponibles para: {{ selectedSupply.name }}</h4>
          <pv-data-table :value="filteredBatches">
            <pv-column header="ID">
              <template #body="{ data }">{{ data.batch.id }}</template>
            </pv-column>
            <pv-column header="Stock">
              <template #body="{ data }">{{ data.batch.stock }}</template>
            </pv-column>
            <pv-column header="Caducidad">
              <template #body="{ data }">{{ data.batch.expiration_date }}</template>
            </pv-column>
            <pv-column header="Proveedor">
              <template #body="{ data }">{{ data.supplier.name }}</template>
            </pv-column>
            <pv-column header="Seleccionar">
              <template #body="{ data }">
                <pv-checkbox
                    :value="data.batch.id"
                    :binary="true"
                    :model-value="selectedBatchIds.includes(data.batch.id)"
                    @change="() => toggleBatchSelection(data.batch.id, data)"
                />
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
  <pv-toast position="top-right"/>
  <order-details-modal-component
      v-model="showConfirmModal"
      :selected-batches="confirmedBatches"
      @submitted="handleFinalConfirmation"
      @back="goBackFromDetails"
  />


</template>

<style scoped>
.modal-step {
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