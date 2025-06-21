<script> import BaseModal from '../../../../shared/components/base-modal.component.vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import OrderDetailsModalComponent from './order-details-modal.component.vue';
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
    OrderDetailsModalComponent,
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
      allBatches: [],
      supplierProfiles: [],
      filteredBatches: [],
      selectedBatchIds: [],
      currentSelection: [],
      fullOrder: [],
      showConfirmModal: false,
      confirmedBatches: []
    };
  },
  computed: {
    selectedBatches() {
      return this.filteredBatches.filter(b => this.selectedBatchIds.includes(b.batch.id));
    }
  },
  watch: {
    modelValue(val) {
      if (val) this.resetModal();
    }
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      const [suppliesRes, batchesRes, usersRes, profilesRes] = await Promise.all([new SupplyService().getAll(), new SupplyBatchService().getAll(), new UserService().getAll(), new ProfileService().getAll()]);
      this.allSupplies = SupplyAssembler.toEntitiesFromResponse(suppliesRes);
      this.allBatches = batchesRes.data;
      const users = UserAssembler.toEntitiesFromResponse(usersRes);
      const profiles = ProfileAssembler.toEntitiesFromResponse(profilesRes);
      this.supplierProfiles = users.map(user => {
        const profile = profiles.find(p => p.userId === user.id);
        return {id: user.id, name: profile?.name || user.email, company: profile?.companyName || ''};
      });
    }, resetModal() {
      this.step = 1;
      this.selectedSupply = null;
      this.selectedBatchIds = [];
      this.filteredBatches = [];
      this.currentSelection = [];
    }, onSupplySelect() {
      if (!this.selectedSupply?.id) {
        this.filteredBatches = [];
        return;
      }
      const {id: supplyId, userId} = this.selectedSupply;
      this.filteredBatches = this.allBatches.filter(batch => batch.supply_id === supplyId).map(batch => {
        const supplier = this.supplierProfiles.find(p => p.id === (batch.supplier_id ?? userId)) || {name: 'Desconocido'};
        return {batch, supply: this.selectedSupply, supplier};
      }).filter(entry => {
        return !this.fullOrder.some(o => o.batch.id === entry.batch.id);
      });
    },
    nextStep() {
      if (!this.selectedBatches.length) return;

      // Agrega los seleccionados al acumulado, pero sin repetir
      this.selectedBatches.forEach(entry => {
        if (!this.confirmedBatches.some(e => e.batch.id === entry.batch.id)) {
          this.confirmedBatches.push(entry);
        }
      });

      // Luego de agregar, espera al próximo tick para abrir modal
      this.$nextTick(() => {
        this.step = 2;
        this.showConfirmModal = true;
      });
    },
    goBackFromDetails() {
      this.step = 1;
      this.showConfirmModal = false;
    }, closeModal() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    async handleFinalConfirmation({batches, quantities}) {
      batches.forEach(entry => {
        if (!this.confirmedBatches.some(e => e.batch.id === entry.batch.id)) {
          this.confirmedBatches.push(entry);
        }
      });

      // Reset visual
      this.selectedBatchIds = [];
      this.selectedSupply = null;
      this.filteredBatches = [];
      this.showConfirmModal = false;
      this.step = 1;
      try {
        const orderService = new OrderToSupplierService();
        const batchService = new OrderToSupplierBatchService();
        const grouped = this.fullOrder.reduce((acc, entry) => {
          const supplierId = entry.supplier.id;
          if (!acc[supplierId]) acc[supplierId] = [];
          acc[supplierId].push(entry);
          return acc;
        }, {});
        for (const [supplierId, entries] of Object.entries(grouped)) {
          const now = new Date();
          const orderPayload = {
            date: now.toISOString(),
            estimated_ship_date: now.toISOString(),
            estimated_ship_time: now.toISOString(),
            description: 'Order',
            admin_restaurant_id: 4,
            supplier_id: Number(supplierId),
            order_to_supplier_state_id: 1,
            order_to_supplier_situation_id: 1,
            requested_products_count: entries.length,
            total_price: entries.reduce((sum, e) => sum + ((quantities[e.batch.id] || 0) * (e.supply.price || 0)), 0),
            partially_accepted: false
          };
          const orderRes = await orderService.create(orderPayload);
          const orderId = orderRes.data.id;
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
        this.fullOrder = [];
      } catch (err) {
        console.error('Error creando órdenes:', err);
        console.log('🧪 Batches passed to detail modal:', this.fullOrder.concat(this.selectedBatches));
      }
    }
  }
};
</script>
<template>
  <base-modal :model-value="modelValue" title="Crear orden de compra" @close="closeModal">
    <template #default>
      <div class="modal-step"><label>Selecciona un insumo:</label>
        <pv-select v-model="selectedSupply" :options="allSupplies" optionLabel="name" placeholder="Selecciona un insumo"
                   @change="onSupplySelect"/>
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
                <pv-checkbox :value="data.batch.id" v-model="selectedBatchIds"/>
              </template>
            </pv-column>
          </pv-data-table>
        </div>
      </div>
    </template>

    <template #footer>
      <pv-button label="Cancelar" class="btn-cancel" @click="closeModal"/>
      <pv-button label="Siguiente" class="btn-next" :disabled="!selectedBatchIds.length" @click="nextStep"/>
    </template>
  </base-modal>
  <order-details-modal-component
      v-model="showConfirmModal"
      :selected-batches="confirmedBatches"
      @submitted="handleFinalConfirmation"
      @back="goBackFromDetails"
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