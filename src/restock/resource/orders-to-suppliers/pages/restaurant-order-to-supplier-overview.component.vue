<script> import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import {OrderToSupplierService} from '../services/order-to-supplier.service.js';
import {OrderToSupplierBatchService} from '../services/order-to-supplier-batch.service.js';
import {SupplyService} from '../../inventory/services/supply.service.js';
import {UserService} from '../../../iam/services/user.service.js';
import {UnitMeasurementService} from '../../inventory/services/unit-measurement.service.js';
import {OrderToSupplierStateService} from '../services/order-to-supplier-state.service.js';
import {OrderToSupplierSituationService} from '../services/order-to-supplier-situation.service.js';
import OrderNowModal from '../components/order-now-modal.component.vue';
import OrderToSupplierTable from '../components/order-to-supplier-table.component.vue';
import PlaceOrderModalComponent from "../components/place-order-modal.component.vue";
import OrderFeedbackModalComponent from "../components/order-feedback-modal.component.vue";
import OrderDetailsModalComponent from "../components/order-details-modal.component.vue";

export default {
  name: 'RestaurantOrderToSupplierOverview',
  components: {
    OrderDetailsModalComponent,
    OrderFeedbackModalComponent,
    PlaceOrderModalComponent,
    'pv-select': Select,
    'pv-input-text': InputText,
    'pv-button': Button,
    OrderNowModal,
    OrderToSupplierTable
  },
  data() {
    return {
      orders: [],
      suppliesInOrders: [],
      supplies: [],
      suppliers: [],
      units: [],
      states: [],
      situations: [],
      selectedSupplier: null,
      searchText: '',
      showOrderModal: false,
      currentRestaurantId: 4,
      showOrderDetails: false,
      showFeedbackModal: false,
      selectedOrder: null,
    };
  },

  computed: {
    hasOrders() {
      return this.orders.length > 0 && this.suppliesInOrders.length > 0;
    }, filteredOrders() {
      return this.orders.filter(order => {
        const supplier = order.supplier; // ahora ya viene embebido
        const supplierMatch = this.selectedSupplier ? supplier?.id === this.selectedSupplier.id : true;
        const searchMatch = this.searchText ? (supplier?.name || '').toLowerCase().includes(this.searchText.toLowerCase()) || (supplier?.email || '').toLowerCase().includes(this.searchText.toLowerCase()) || (order.description || '').toLowerCase().includes(this.searchText.toLowerCase()) : true;
        return supplierMatch && searchMatch;
      });
    }
  }, methods: {
    async loadData() {
      const [ordersRes, orderSuppliesRes, suppliesRes, usersRes, unitsRes, statesRes, situationsRes] = await Promise.all([new OrderToSupplierService().getAll(), new OrderToSupplierBatchService().getAll(), new SupplyService().getAll(), new UserService().getAll(), new UnitMeasurementService().getAll(), new OrderToSupplierStateService().getAll(), new OrderToSupplierSituationService().getAll()]);
      const rawOrders = ordersRes.data.filter(o => o.admin_restaurant_id === this.currentRestaurantId);
      const enrichedOrders = rawOrders.map(order => {
        const state = statesRes.data.find(s => s.id === order.order_to_supplier_state_id);
        const situation = situationsRes.data.find(s => s.id === order.order_to_supplier_situation_id);
        const supplier = usersRes.data.find(s => s.id === order.supplier_id);
        return {...order, state, situation, supplier};
      });
      this.orders = enrichedOrders;
      this.suppliesInOrders = orderSuppliesRes.data;
      this.supplies = suppliesRes.data;
      this.suppliers = usersRes.data;
      this.units = unitsRes.data;
      this.states = statesRes.data;
      this.situations = situationsRes.data;
    },
    openDetails(order) {
      this.selectedOrder = order
      this.showOrderDetails = true
    },
    openFeedback(order) {
      if (order.state?.name?.toLowerCase() !== 'delivered') {
        alert("Feedback is only allowed for delivered orders.");
        return;
      }
      this.selectedOrder = order;
      this.showFeedbackModal = true;
    }
  }, mounted() {
    this.loadData();
  }, watch: {
    showOrderModal(val) {
      if (!val) {
        setTimeout(() => {
          this.loadData();
        }, 500);
      }
    }
  }
};
</script>

<template>
  <div class="overview-container">
    <div class="header"><h2>My Supply Orders</h2>
      <pv-button icon="pi pi-plus" label="Create Order" class="btn-create" @click="showOrderModal = true"/>
    </div>
    <div class="filters">
      <pv-select
          v-model="selectedSupplier"
          :options="suppliers"
          optionLabel="name"
          placeholder="Filter by Supplier"
          class="filter-select"
      />
      <pv-input-text v-model="searchText" placeholder="Search by name or description..." class="filter-input"/>
    </div>

    <div v-if="filteredOrders.length">
      <order-to-supplier-table
          :orders="filteredOrders"
          :suppliers="suppliers"
          :states="states"
          :situations="situations"
          @viewDetails="openDetails"
          @leaveFeedback="openFeedback"
      />
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-truck empty-icon"/>
      <p class="empty-text">
        You currently have no orders registered.<br/>
        Create a new order to start managing your purchases and supplies from this section.
      </p>
    </div>

    <!-- Modals -->
    <order-now-modal v-model="showOrderModal" @close="showOrderModal = false"/>
    <order-details-modal-component
        v-if="selectedOrder"
        :visible="showOrderDetails"
        :order="selectedOrder"
        :providerProfiles="suppliers"
        @close="showOrderDetails = false"
    />

    <order-feedback-modal-component
        v-if="selectedOrder"
        :visible="showFeedbackModal"
        :order="selectedOrder"
        :providerProfiles="suppliers"
        @close="showFeedbackModal = false"
    />
  </div>
</template>
<style scoped>
.overview-container {
  padding: 1.5rem;

  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-select, .filter-input {
  flex: 1;
  min-width: 250px;
}

.btn-create {
  background-color: #4f8a5b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed #ccc;
  border-radius: 12px;
  background-color: #fafafa;
}

.empty-icon {
  font-size: 3rem;
  color: #aaa;
  margin-bottom: 1rem;
}

.empty-text {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>