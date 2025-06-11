<script> import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import {OrderToSupplierService} from '../services/order-to-supplier.service.js';
import {OrderToSupplierSupplyService} from '../services/order-to-supplier-supply.service.js';
import {SupplyService} from '../../inventory/services/supply.service.js';
import {UserService} from "../../../iam/services/user.service.js";
import {UnitMeasurementService} from '../../inventory/services/unit-measurement.service.js';
import {OrderToSupplierStateService} from '../services/order-to-supplier-state.service.js';
import {OrderToSupplierSituationService} from '../services/order-to-supplier-situation.service.js';
import OrderNowModal from '../components/order-now-modal.component.vue';

export default {
  name: 'RestaurantOrderToSupplierOverview',
  components: {
    'pv-data-table': DataTable,
    'pv-column': Column,
    'pv-select': Select,
    'pv-input-text': InputText,
    'pv-button': Button,
    OrderNowModal
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
      selectedSupply: null,
      selectedSupplier: null,
      searchText: '',
      showOrderModal: false,
      currentRestaurantId: 4
    };
  },
  computed: {
    combinedData() {
      return this.suppliesInOrders.map(so => {
        const order = this.orders.find(o => o.id === so.order_to_supplier_id);
        if (!order || order.admin_restaurant_id !== this.currentRestaurantId) return null;
        const supply = this.supplies.find(s => s.id === so.supply_id);
        const unit = this.units.find(u => u.id === supply?.unit_measurement_id);
        const supplier = this.suppliers.find(u => u.id === order.supplier_id);
        const state = this.states.find(s => s.id === order.order_to_supplier_state_id);
        const situation = this.situations.find(s => s.id === order.order_to_supplier_situation_id);
        return {
          situation: situation?.name || 'Unknown',
          state: state?.name || 'Unknown',
          supplierName: supplier?.name || supplier?.email || 'Unknown',
          supplyName: supply?.name || 'Unnamed',
          quantity: so.quantity,
          unit: unit?.name || '-',
          price: order.total_price || 0
        };
      }).filter(Boolean);
    }, filteredData() {
      return this.combinedData.filter(item => {
        const matchSupply = this.selectedSupply ? item.supplyName === this.selectedSupply.name : true;
        const matchSupplier = this.selectedSupplier ? (item.supplierName === this.selectedSupplier.name || item.supplierName === this.selectedSupplier.email) : true;
        const matchSearch = this.searchText ? item.supplyName.toLowerCase().includes(this.searchText.toLowerCase()) || item.supplierName.toLowerCase().includes(this.searchText.toLowerCase()) : true;
        return matchSupply && matchSupplier && matchSearch;
      });
    }
  },
  async mounted() {
    const orderService = new OrderToSupplierService();
    const supplyRelService = new OrderToSupplierSupplyService();
    const supplyService = new SupplyService();
    const userService = new UserService();
    const unitService = new UnitMeasurementService();
    const stateService = new OrderToSupplierStateService();
    const situationService = new OrderToSupplierSituationService();
    const [ordersRes, orderSuppliesRes, suppliesRes, usersRes, unitsRes, statesRes, situationsRes] = await Promise.all([orderService.getAll(), supplyRelService.getAll(), supplyService.getAll(), userService.getAll(), unitService.getAll(), stateService.getAll(), situationService.getAll()]);
    this.orders = ordersRes.data.filter(o => o.admin_restaurant_id === this.currentRestaurantId);
    this.suppliesInOrders = orderSuppliesRes.data;
    this.supplies = suppliesRes.data;
    this.suppliers = usersRes.data;
    this.units = unitsRes.data;
    this.states = statesRes.data;
    this.situations = situationsRes.data;
  }
}; </script>
<template>
  <div class="overview-container">
    <div class="header"><h2>My Supply Orders</h2>
      <pv-button icon="pi pi-plus" label="Create Order" class="btn-create" @click="showOrderModal = true"/>
    </div>
    <div class="filters">
      <pv-select v-model="selectedSupply" :options="supplies" optionLabel="name" placeholder="Filter by Supply"/>
      <pv-select v-model="selectedSupplier" :options="suppliers" optionLabel="name" placeholder="Filter by Supplier"/>
      <pv-input-text v-model="searchText" placeholder="Search by name..."/>
    </div>

    <pv-data-table :value="filteredData" paginator :rows="5" :rows-per-page-options="[5, 10, 15]"
                   responsive-layout="scroll">
      <pv-column field="situation" header="Situation"></pv-column>
      <pv-column field="state" header="State"></pv-column>
      <pv-column field="supplierName" header="Supplier"></pv-column>
      <pv-column field="supplyName" header="Supply"></pv-column>
      <pv-column field="quantity" header="Quantity"></pv-column>
      <pv-column field="unit" header="Unit"></pv-column>
      <pv-column field="price" header="Final Price" :body="data => `S/ ${Number(data.price).toFixed(2)}`"></pv-column>
    </pv-data-table>

    <order-now-modal v-model="showOrderModal" @close="showOrderModal = false"/>
  </div>
</template>
<style scoped> .overview-container {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-create {
  background-color: #4F8A5B;
  color: white;
} </style>