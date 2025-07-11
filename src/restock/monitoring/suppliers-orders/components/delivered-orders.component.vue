<script>
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import FiltersSection from "./filters-section.vue";
import * as XLSX from 'xlsx';

export default {
  name: "delivered-orders",
  components: {FiltersSection, EmptySection},
  props: {
    orders: {
      type: Array,
      required: true,
    },
    ordersSupplies: {
      type: Array,
      required: true,
    },
    adminRestaurantsProfiles: {
      type: Array,
      required: true,
    }
  },
  emits: ['open-details-modal'],
  data() {
    return {
      selectedOrder: null,
      showDetailsModal: false,
      // Filters
      searchQuery: '',
      selectedDateRange: '',
      sortField: 'date',
      sortOrder: 1, // 1 to increase, -1 to descendent
    }
  },
  methods: {
    filteredOrders() {
      let filteredOrders = [...this.orders];

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(order => {
          const restaurantName = this.restaurantBusinessNamesPerOrder[order.id]?.toLowerCase() || '';
          const orderDate = order.date?.toLowerCase() || '';

          return restaurantName.includes(query) ||
              orderDate.includes(query)
        });
      }

      // Date Range filter
      if (this.selectedDateRange && this.selectedDateRange !== '') {
        const now = new Date();
        let dateLimit;

        switch (this.selectedDateRange) {
          case '7days':
            dateLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '3months':
            dateLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        }

        if (dateLimit) {
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= dateLimit;
          });
        }
      }

      // Sort by date
      filteredOrders.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return this.sortOrder === 1 ? dateA - dateB : dateB - dateA;
      });
      return filteredOrders;
    },
    formatDate(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    },

    requestedSuppliesCount(order) {
      if(order.partiallyAccepted)
      {
        const rejectedSuppliesCount = this.ordersSupplies.filter(supply => Number(supply.orderId) === Number(order.id) && supply.accepted === false).length;
        return order.requestedProductsCount - rejectedSuppliesCount;
      }
      else
      {
        return order.requestedProductsCount;
      }
    },
    rowClass(order) {
      if (order.stateId === 4) {
        return 'row-delivered';
      }
      return '';
    },
    openOrderAcceptedDetailsModal(order) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
      this.$emit('open-details-modal', order);
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },
    downloadHistory() {
      console.log('Downloading order history...');
      this.generateExcelWithSheetJS();
    },
    generateExcelWithSheetJS() {
      const orders = this.filteredOrders();

      const data = orders.map(order => ({
        'Order Date': order.date ? this.formatDate(order.date) : 'Not set',
        'Ship Date': order.estimatedShipDate ? this.formatDate(order.estimatedShipDate) : 'Not set',
        'Restaurant Name': this.restaurantBusinessNamesPerOrder[order.id] || 'Unknown',
        'Requested Products': this.requestedSuppliesCount(order),
        'Final Price': `S/ ${order.totalPrice}`
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(wb, ws, 'Orders');

      XLSX.writeFile(wb, 'orders_history.xlsx');
    },
  },
  computed: {
    restaurantBusinessNamesPerOrder() {
      const nameMap = {};

      this.orders.forEach(order => {
        const profile = this.adminRestaurantsProfiles.find(p => p.user_id === order.adminRestaurantId);

        nameMap[order.id] = profile ? profile.business.name : 'Unknown Restaurant';
      });

      return nameMap;
    }
  }
}
</script>

<template>

  <filters-section
      title="Orders"
      @update:searchQuery="searchQuery = $event"
      @update:selectedDateRange="selectedDateRange = $event"
      :search-query="searchQuery"
      :selected-date-range="selectedDateRange"
      :search-placeholder="'Search orders by restaurant...'"
      :sort-order="sortOrder"
      sort-label="Order Date"
      @toggle-sort="toggleSort"
  >
    <!-- Slot for Download -->
    <template #actions>
      <pv-button
          @click="downloadHistory"
          class="download-button"
          severity="success"
      >
        <i class="pi pi-download"></i>
        {{ $t('supplier-orders.filters.download') }}
      </pv-button>
    </template>

  </filters-section>

  <!-- Empty -->
  <empty-section v-if="filteredOrders().length === 0">
    {{ $t('supplier-orders.empty.history-orders') }}
    <template #icon>
      <i class="pi pi-truck" style="font-size: 3rem; color: #bcbcbc;"></i>
    </template>
  </empty-section>

  <pv-data-table
      v-if="filteredOrders().length > 0"
      :value="filteredOrders()"
      paginator
      :rows="5"
      :rows-per-page-options="[4, 6, 8, 10]"
      responsive-layout="scroll"
      :row-class="rowClass"
  >
    <pv-column field="date" :header="$t('supplier-orders.table.date')">
      <template #body="{ data }">
        {{ formatDate(data.date) }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.ship-date')">
      <template #body="{ data }">
        {{ data.estimatedShipDate ? formatDate(data.estimatedShipDate) : 'Not set' }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.restaurant-name')">
      <template #body="{ data }">
        {{ restaurantBusinessNamesPerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.requested-products')">
      <template #body="{ data }">
        {{ requestedSuppliesCount(data) }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.final-price')">
      <template #body="{ data }">
        S/ {{ data.totalPrice }}
      </template>
    </pv-column>

    <pv-column>
      <template #body="{ data }">
        <pv-button
            class="p-button-icon-style"
            icon="pi pi-book text-base"
            @click="openOrderAcceptedDetailsModal(data)"
            text
        />
      </template>
    </pv-column>

  </pv-data-table>

</template>

<style>
.row-delivered {
  background-color: rgba(76, 138, 58, 0.3) !important; /* verde muy claro */
}

.filter-dropdown {
  min-width: 120px;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: #4F8A5B !important;
  color: white;
  border: none !important;
}

.download-button:hover {
  background-color: #2c4e33 !important;
  border: none !important;
}

</style>