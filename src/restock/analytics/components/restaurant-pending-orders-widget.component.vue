<script>
import OrderToSupplierTable from '../../resource/orders-to-suppliers/components/order-to-supplier-table.component.vue';
import { getOrdersToSupplierFromRestaurant } from '../../resource/orders-to-suppliers/services/order-to-supplier.service.js';
import { OrderToSupplierSituationService } from '../../resource/orders-to-suppliers/services/order-to-supplier-situation.service.js';
import { OrderToSupplierStateService } from '../../resource/orders-to-suppliers/services/order-to-supplier-state.service.js';
import { UserService } from '../../iam/services/user.service.js';
import { ProfileService } from '../../profiles/services/profile.service.js';

export default {
  name: 'RestaurantPendingOrdersWidget',
  components: { OrderToSupplierTable },
  data() {
    return {
      allOrders: [],
      suppliers: [],
      situations: [],
      situationFilter: null
    };
  },
  computed: {
    visibleSituations() {
      const presentNames = new Set(this.allOrders.map(o => o.situation?.name).filter(Boolean));
      return this.situations.filter(s => presentNames.has(s.name));
    },
    filteredOrders() {
      if (!this.situationFilter) return [];
      return this.allOrders.filter(o =>
          o.situation?.name?.toLowerCase() === this.situationFilter.toLowerCase()
      );
    }
  },
  async mounted() {
    console.log('⏳ Cargando órdenes, situaciones y estados...');

    const orders = await getOrdersToSupplierFromRestaurant();

    // Cargar situaciones y estados
    const situationService = new OrderToSupplierSituationService();
    const stateService = new OrderToSupplierStateService();
    const [situationsRes, statesRes] = await Promise.all([
      situationService.getAll(),
      stateService.getAll()
    ]);

    const situations = situationsRes.data || [];
    const states = statesRes.data || [];
    this.situations = situations;

    const situationMap = new Map(situations.map(s => [s.id, s]));
    const stateMap = new Map(states.map(s => [s.id, s]));

    // Enriquecer órdenes
    const enrichedOrders = orders.map(o => {
      o.situation = situationMap.get(Number(o.situationId)) || null;
      o.state = stateMap.get(Number(o.stateId)) || null;
      return o;
    });

    console.log('📦 Órdenes enriquecidas: ', enrichedOrders);
    this.allOrders = enrichedOrders;

    this.situationFilter = this.visibleSituations.length === 1
        ? this.visibleSituations[0].name
        : 'Pending';


    // Cargar proveedores
    const userService = new UserService();
    const profileService = new ProfileService();
    const usersRes = await userService.getByRoleId(1); // 1: supplier
    const users = usersRes.data || [];
    const profilePromises = users.map(u => profileService.getByQuery('user_id', u.id));
    const profilesResponses = await Promise.all(profilePromises);
    const profiles = profilesResponses.flatMap(res => res.data || []);

    this.suppliers = profiles.map(p => ({
      id: p.user_id,
      name: p.name
    }));
  },
  methods: {
    goToOrders() {
      this.$router.push('/dashboard/restaurant/orders');
    },
    setFilter(situation) {
      this.situationFilter = situation;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    getSupplierName(supplierId) {
      const supplier = this.suppliers.find(s => s.id === supplierId);
      return supplier ? supplier.name : 'Unknown';
    }
  }
};
</script>

<template>
  <div>
    <h3 class="widget-title">My Orders</h3>
    <div class="filter-buttons" v-if="visibleSituations.length">
      <button
          v-for="s in visibleSituations"
          :key="s.id"
          :class="['filter-btn', { active: situationFilter === s.name }]"
          @click="setFilter(s.name)"
      >
        {{ s.name }}
      </button>
    </div>

    <div class="widget-containern">
      <div class="widget-orders-wrapper">
        <div class="scroll-wrapper">
          <div class="custom-orders-table">
            <table class="orders-widget-table">
              <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>State</th>
                <th>Total</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ formatDate(order.date) }}</td>
                <td>{{ getSupplierName(order.supplierId) }}</td>
                <td>{{ order.state?.name || '-' }}</td>
                <td>S/ {{ order.totalPrice.toFixed(2) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="view-all-button-container">
          <button @click="goToOrders" class="view-all-btn" title="Ver todas las órdenes">
            <i class="pi pi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.widget-containern {
  background: #fff;
  padding: 20px 24px 5px 24px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-btn:hover {
  background: #e0e0e0;
}

.filter-btn.active {
  background: #007bff;
  color: white;
}
.scroll-wrapper {
  flex: 1;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid #eee;
}

.orders-widget-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.orders-widget-table thead {
  background-color: #f9f9f9;
}

.orders-widget-table th,
.orders-widget-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-widget-table tbody tr:hover {
  background-color: #f5f5f5;
}

.view-all-btn{
  background: #FFFFFF;
}
</style>