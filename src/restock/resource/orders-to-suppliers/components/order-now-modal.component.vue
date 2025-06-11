<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CheckBox from 'primevue/checkbox';

// Services y Assembler
import {SupplyService} from "../../inventory/services/supply.service.js";
import {UnitMeasurementService} from "../../inventory/services/unit-measurement.service.js";
import {SupplyAssembler} from "../../inventory/services/supply.assembler.js";
import {UnitMeasurementAssembler} from "../../inventory/services/unit-measurement.assembler.js";
import {ProfileAssembler} from "../../../profiles/services/profile.assembler.js";
import {UserAssembler} from "../../../iam/services/user.assembler.js";
import {OrderToSupplierAssembler} from "../services/order-to-supplier.assembler.js";
import {OrderToSupplierSupplyAssembler} from "../services/order-to-supplier-supply.assembler.js";
import {OrderToSupplierService} from "../services/order-to-supplier.service.js";
import {OrderToSupplierSupplyService} from "../services/order-to-supplier-supply.service.js";
import {ProfileService} from "../../../profiles/services/profile.service.js";
import {UserService} from "../../../iam/services/user.service.js";
import ConfirmOrderToSupplier from "./confirm-order-to-supplier.component.vue";


export default {
  name: "OrderNowModal",
  components: {
    ConfirmOrderToSupplier,
    BaseModal,
    'pv-select': Select,
    'pv-button': Button,
    'pv-data-table': DataTable,
    'pv-column': Column,
    'pv-checkbox': CheckBox
  },
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue', 'close'],
  data() {
    return {
      step: 1,
      selectedSupply: null,
      selectedSuppliers: [],
      supplierOptions: [],
      showConfirmModal: false
    };
  },
  computed: {
    selectedSupplierObjects() {
      return this.selectedSuppliers.map(id => this.supplierOptions.find(s => s.id === id)).filter(Boolean);
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.resetModal();
      }
    }
  },
  async mounted() {
    await this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      try {
        const supplyService = new SupplyService();
        const unitService = new UnitMeasurementService();
        const [supplyRes, unitRes] = await Promise.all([
          supplyService.getAll(),
          unitService.getAll()
        ]);
        const supplies = SupplyAssembler.toEntitiesFromResponse(supplyRes);
        // this.restaurantSupplies = supplies.filter(s => s.userId === this.currentRestaurantId); SI QUIERO USAR ESTO TENGO QUE CAMBIAR LOS DATOS EN EL DBJSON, por el momento dejar acá
        this.restaurantSupplies = supplies;
        this.unitsMeasurement = UnitMeasurementAssembler.toEntitiesFromResponse(unitRes);
      } catch (err) {
        console.error("Error loading supplies or units:", err);
      }
    },

    async onSupplySelect() {
      try {
        const supplyId = this.selectedSupply?.id;
        if (!supplyId) return;

        const orderSupplyService = new OrderToSupplierSupplyService();
        const orderService = new OrderToSupplierService();
        const userService = new UserService();
        const profileService = new ProfileService();

        const rawOrderSupplies = await orderSupplyService.getBySupplyId(supplyId);
        const orderSupplies = OrderToSupplierSupplyAssembler.toEntitiesFromResponse(rawOrderSupplies);
        const orderIds = [...new Set(orderSupplies.map(o => o.orderId))];

        if (orderIds.length === 0) {
          this.supplierOptions = [];
          return;
        }

        const rawOrders = await Promise.all(orderIds.map(id => orderService.getById(id)));
        const orders = rawOrders.map(res => OrderToSupplierAssembler.toEntityFromResource(res.data));
        const supplierIds = [...new Set(orders.map(o => o.supplierId))];

        const [rawUsers, rawProfiles] = await Promise.all([
          userService.getAll(),
          profileService.getAll()
        ]);
        const users = UserAssembler.toEntitiesFromResponse(rawUsers);
        const profiles = ProfileAssembler.toEntitiesFromResponse(rawProfiles);

        this.supplierOptions = supplierIds.map(supplierId => {
          const user = users.find(u => u.id === supplierId);
          const profile = profiles.find(p => p.userId === supplierId);
          const order = orders.find(o => o.supplierId === supplierId);
          const supplyInOrder = orderSupplies.find(s => s.orderId === order.id);

          return {
            id: supplierId,
            name: profile?.name || user?.email || 'Unknown Supplier',
            price: this.selectedSupply.price,
            stock: supplyInOrder?.quantity || 0
          };
        });
      } catch (err) {
        console.error("Error loading supplier options:", err);
      }
    },

    closeModal() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },

    resetModal() {
      this.step = 1;
      this.selectedSupply = null;
      this.supplierOptions = [];
      this.selectedSuppliers = [];
    },

    nextStep() {
      if (this.selectedSupplierObjects.length > 0) {
        this.showConfirmModal = true;
      } else {
        this.$toast.add({ severity: 'warn', summary: 'Warning', detail: 'Select at least one supplier', life: 3000 });
      }
    },

    prevStep() {
      this.step = 1;
    },
    confirmOrder() {
      this.showSummaryModal = true;
    },
    handleFinalConfirmation(data) {
      console.log('Final confirmed order data:', data);
      // Aquí puedes llamar a tu servicio para guardar la orden en backend
      this.closeModal();
    }
  }
};
</script>

<template>
  <base-modal :model-value="modelValue" title="Create New Order" @close="closeModal">
    <template #default>
      <div class="modal-step">
        <p>Select the supply you need:</p>
        <pv-select
            v-model="selectedSupply"
            :options="restaurantSupplies"
            optionLabel="name"
            placeholder="Select a supply"
            @change="onSupplySelect"
        />
        <div v-if="supplierOptions.length">
          <h4>Available Suppliers</h4>
          <pv-data-table :value="supplierOptions">
            <pv-column field="name" header="Supplier" />
            <pv-column field="price" header="Price" />
            <pv-column field="stock" header="Stock" />
            <pv-column header="Select">
              <template #body="slotProps">
                <pv-checkbox :value="slotProps.data.id" v-model="selectedSuppliers" />
              </template>
            </pv-column>
          </pv-data-table>
        </div>
      </div>
    </template>

    <template #footer>
      <pv-button label="Close" class="btn-close" @click="closeModal" />
      <pv-button v-if="selectedSupply && selectedSuppliers.length" label="Next" class="btn-next" @click="nextStep" />
    </template>
  </base-modal>

  <confirm-order-to-supplier
      v-model="showConfirmModal"
      :supply="selectedSupply"
      :selected-suppliers="selectedSupplierObjects"
      @submitted="closeModal"
  />
</template>

<style>
.modal-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-close {
  background-color: #ccc;
}

.btn-next {
  background-color: #F28C38;
  color: white;
}

.btn-back {
  background-color: #F28C38;
  color: white;
}

.btn-confirm {
  background-color: #4F8A5B;
  color: white;
}
</style>
