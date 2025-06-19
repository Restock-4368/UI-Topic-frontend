<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-6">{{ $t('notifications.title') }}</h2>

    <div class="flex space-x-4 mb-4">
      <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 rounded"
          :class="activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
      >
        {{ tab }}
      </button>
    </div>

    <table class="w-full text-left border-collapse rounded shadow overflow-hidden">
      <thead class="bg-gray-100 text-gray-600 uppercase text-sm">
      <tr>
        <th class="px-4 py-3">Ingredients</th>
        <th class="px-4 py-3">Location</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3">Last update</th>
      </tr>
      </thead>
      <tbody class="text-gray-700">
      <tr
          v-for="alert in filteredAlerts"
          :key="alert.ingredient"
          class="border-t hover:bg-gray-50"
      >
        <td class="px-4 py-3">{{ alert.ingredient }}</td>
        <td class="px-4 py-3">{{ alert.location }}</td>
        <td class="px-4 py-3">
            <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                'bg-red-100 text-red-600': alert.status === 'LOW STOCK',
                'bg-orange-100 text-orange-600': alert.status === 'MAX STOCK'
              }"
            >
              {{ alert.status }}
            </span>
        </td>
        <td class="px-4 py-3">{{ alert.lastUpdate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {SupplyBatchService} from "../services/supply-batch.service.js";
import {OrderToSupplierService} from "../../orders-to-suppliers/services/order-to-supplier.service.js";

export default {
  name: 'RestaurantNotificationsOverview',
  data() {
    return {
        tabs: ['All', 'Inventory', 'Orders'],
        activeTab: 'All',
        notifications: []
    };
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
