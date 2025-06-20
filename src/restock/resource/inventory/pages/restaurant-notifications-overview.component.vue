<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-6">{{ $t('notifications.title') }}</h2>

    <div class="flex space-x-4 mb-4">
      <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 rounded"
          :class="activeTab === tab ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'"
      >
        {{ tab }}
      </button>
    </div>

    <div>
      <div
          v-for="(notification, index) in displayedNotifications"
          :key="index"
          class="p-4 surface-card shadow-2 flex flex-column gap-2"
      >
        <i
            :class="notification.type === 'inventory' ? 'pi pi-box text-yellow-600' : 'pi pi-truck text-green-600'"
            class="text-lg"
        ></i>
        <p class="m-0 font-medium">
          {{ notification.message }}</p>
        <span class="text-xs text-gray-500">{{ formatDate(notification.date) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {SupplyBatchService} from "../services/supply-batch.service.js";
import {OrderToSupplierService} from "../../orders-to-suppliers/services/order-to-supplier.service.js";
import {SupplyService} from "../services/supply.service.js";
import {OrderToSupplierStateService} from "../../orders-to-suppliers/services/order-to-supplier-state.service.js";
import {
  OrderToSupplierSituationService
} from "../../orders-to-suppliers/services/order-to-supplier-situation.service.js";
import {SupplyBatchAssembler} from "../services/supply-batch.assembler.js";
import {SupplyAssembler} from "../services/supply.assembler.js";
import {OrderToSupplierAssembler} from "../../orders-to-suppliers/services/order-to-supplier.assembler.js";
import {OrderToSupplierStateAssembler} from "../../orders-to-suppliers/services/order-to-supplier-state.assembler.js";
import {
  OrderToSupplierSituationAssembler
} from "../../orders-to-suppliers/services/order-to-supplier-situation.assembler.js";

export default {
  name: 'RestaurantNotificationsComponent',
  data() {
    return {
        tabs: ['All', 'Inventory', 'Orders'],
        activeTab: 'All',
        notifications: []
    };
  },
  async created() {
    await this.loadNotifications();
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : ' ';
    },
    async loadNotifications() {
      try {
        const batchService = new SupplyBatchService();
        const supplyService = new SupplyService();
        const orderService = new OrderToSupplierService();
        const stateService = new OrderToSupplierStateService();
        const situationService = new OrderToSupplierSituationService();

        const [batchRes, supplyRes, orderRes, stateRes, situationRes] = await Promise.all([
          batchService.getAll(),
          supplyService.getAll(),
          orderService.getAll(),
          stateService.getAll(),
          situationService.getAll()
        ]);

        const batches = SupplyBatchAssembler.toEntitiesFromResponse(batchRes);
        console.log('Batches loaded:', batches);
        const supplies = SupplyAssembler.toEntitiesFromResponse(supplyRes);
        const orders = OrderToSupplierAssembler.toEntitiesFromResponse(orderRes);
        const states = OrderToSupplierStateAssembler.toEntitiesFromResponse(stateRes);
        const situations = OrderToSupplierSituationAssembler.toEntitiesFromResponse(situationRes);
        console.log('Supplies loaded:', supplies);

        const supplyMap = new Map();
        supplies.forEach(s => supplyMap.set(Number(s.id), s));

        const inventoryNotifications = [];
        batches.forEach(b => {
          const supply = supplyMap.get(Number(b.supply_id));
          if (!supply) return;
          if (b.stock <= supply.min_stock) {
            inventoryNotifications.push({
              type: 'inventory',
              date: b.expiration_date,
              message: `${supply.name} batch #${b.id} below minimum stock (${b.stock}/${supply.min_stock})`
            });
          } else if (b.stock >= supply.max_stock) {
            inventoryNotifications.push({
              type: 'inventory',
              date: b.expiration_date,
              message: `${supply.name} batch #${b.id} reached maximum stock (${b.stock}/${supply.max_stock})`
            });
          }
        });

        const situationPending = situations.find(s => s.name.toLowerCase() === 'pending');
        const deliveredState = states.find(s => s.name.toLowerCase() === 'delivered');
        const orderNotifications = [];
        orders.forEach(o => {
          const situation = situations.find(s => Number(s.id) === Number(o.situationId));
          const state = states.find(s => Number(s.id) === Number(o.stateId));

          if (situation && situationPending && Number(situation.id) !== Number(situationPending.id)) {
            orderNotifications.push({
              type: 'order',
              date: o.date,
              message: `Order #${o.id} situation updated to ${situation.name}`
            });
          }

          if (state && deliveredState && Number(state.id) === Number(deliveredState.id)) {
            orderNotifications.push({
              type: 'order',
              date: o.date,
              message: `Order #${o.id} marked as Delivered`
            });
          }
        });

        this.notifications = [...inventoryNotifications, ...orderNotifications].sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (e) {
        console.error('Error loading notifications', e);
      }
    }
  },
  computed: {
    inventoryNotifications() {
      return this.notifications.filter(n => n.type === 'inventory');
    },
    orderNotifications() {
      return this.notifications.filter(n => n.type === 'order');
    },
    displayedNotifications() {
      switch (this.activeTab) {
        case 'Inventory':
          return this.inventoryNotifications;
        case 'Orders':
          return this.orderNotifications;
        default:
          return this.notifications;
      }
    }
  }
};
</script>

<style scoped>
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #cbd5e0;
}
</style>
