<script>
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import ManageNewOrders from "./manage-new-orders.component.vue";
import FiltersSection from "./filters-section.vue";

export default {
  name: "new-orders",
  components: {FiltersSection, ManageNewOrders, EmptySection},
  props: {
    orderSituations: {
      type: Array,
      required: true,
    },
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
    },
    batches: {
      type: Array,
      required: true,
    },
    supplies: {
      type: Array,
      required: true,
    }
  },
  emits: ['open-modal', 'decline-order', 'open-details-modal'],
  data() {
    return {
      finalPricePerOrder: {},
      suppliesPerOrderCount: {},
      selectedOrder: null,
      showManageModal: false,
      showDetailsModal: false,
      confirm: null,

      // Filters
      searchQuery: '',
      selectedDateRange: null,
      sortField: 'date',
      sortOrder: 1, // 1 to increase, -1 to descendent
    }
  },
  computed: {
    restaurantBusinessNamesPerOrder() {
      const nameMap = {};

      this.orders.forEach(order => {
        const profile = this.adminRestaurantsProfiles.find(p => p.user_id === order.adminRestaurantId);

        nameMap[order.id] = profile ? profile.business.name : 'Unknown Restaurant';
      });

      return nameMap;
    },
    filteredOrders() {
      let filtered = this.orders.filter(order => {
        const situation = this.orderSituations.find(s => Number(s.id) === Number(order.situationId));
        return situation && Number(situation.id) === 1;
      });

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => {
          const restaurantName = this.restaurantBusinessNamesPerOrder[order.id]?.toLowerCase() || '';
          const orderDate = order.date?.toLowerCase() || '';
          return restaurantName.includes(query) || orderDate.includes(query);
        });
      }

      if (this.selectedDateRange) {
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
          filtered = filtered.filter(order => new Date(order.date) >= dateLimit);
        }
      }

      filtered.sort((a, b) => {
        const fieldA = new Date(a[this.sortField]);
        const fieldB = new Date(b[this.sortField]);
        return (fieldA - fieldB) * this.sortOrder;
      });

      return filtered;
    }
  },
  watch: {
    ordersSupplies: {
      handler() {
        this.calculatePricesAndCounts();
      },
      immediate: true,
      deep: true,
    },
    orders: {
      handler() {
        this.calculatePricesAndCounts();
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    resetFilters() {
      this.searchQuery = '';
      this.selectedDateRange = null;
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
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
    calculatePricesAndCounts() {
      if (!this.orders.length || !this.ordersSupplies.length) return;

      const priceMap = {};
      const countMap = {};

      this.orders.forEach(order => {
        const orderId = Number(order.id);
        const orderRequestedBatches = this.ordersSupplies.find(os => Number(os.orderId) === orderId);

        if (!orderRequestedBatches) {
          priceMap[orderId] = 0;
          countMap[orderId] = 0;
          return;
        }

        countMap[orderId] = orderRequestedBatches.requestedBatches?.length;

        priceMap[orderId] = orderRequestedBatches.requestedBatches.reduce((sum, requestedBatchItem) => {
          const batch = this.batches.find(b => Number(b.id) === Number(requestedBatchItem.batchId));

          const supply = this.supplies.find(s => Number(s.id) === Number(batch.supply_id));

          const price = supply?.price || 0;

          return sum + price * requestedBatchItem.quantity;
        }, 0);
      });

      this.finalPricePerOrder = priceMap;
      this.suppliesPerOrderCount = countMap;
    },
    openNewOrderDetailsModal(order) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
      this.$emit('open-details-modal', order);
    },
    manageNewOrder(order) {
      this.selectedOrder = order;
      this.showManageModal = true;
      this.$emit('open-modal', order);
    },
    declineOrder(order) {
      this.$emit('decline-order', order);
    },
    confirmDecline(order) {
      this.$confirm.require({
        message: 'This action is irreversible. Are you sure you want to decline the entire selected order?',
        header: 'Decline Order',
        acceptLabel: 'Yes, decline',
        rejectClass: 'btn-cancel',
        rejectLabel: 'Cancel',
        acceptClass: 'btn-decline',
        accept: () => {
          this.declineOrder(order);
        },
        reject: () => {
          close();
        }
      });
    },

  }
}

</script>

<template>

  <filters-section
      v-model:search-query="searchQuery"
      v-model:selected-date-range="selectedDateRange"
      :sort-order="sortOrder"
      @clear-filters="resetFilters"
      @toggle-sort="toggleSort"
  >

  </filters-section>

  <!-- Empty -->
  <empty-section v-if="filteredOrders.length === 0">
    {{ $t('supplier-orders.empty.new-orders') }}
    <template #icon>
      <i class="pi pi-truck" style="font-size: 3rem; color: #bcbcbc;"></i>
    </template>
  </empty-section>

  <pv-data-table
      v-if="filteredOrders.length > 0"
      :rows="5"
      :rows-per-page-options="[4, 6, 8, 10]"
      :value="filteredOrders"
      paginator
      responsive-layout="scroll"
  >
    <pv-column field="date" :header="$t('supplier-orders.table.date')">
      <template #body="{ data }">
        {{ formatDate(data.date) }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.restaurant-name')">
      <template #body="{ data }">
        {{ restaurantBusinessNamesPerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.requested-products')">
      <template #body="{ data }">
        {{ suppliesPerOrderCount[data.id] }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.final-price')">
      <template #body="{ data }">
        S/ {{ finalPricePerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.actions')">
      <template #body="{ data }">
        <pv-button
            class="p-button-icon-style"
            icon="pi pi-book text-base"
            text
            @click="openNewOrderDetailsModal(data)"
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-check text-base"
            text
            @click="manageNewOrder(data)"
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-times text-base"
            text
            @click="confirmDecline(data)"
        />


      </template>
    </pv-column>

  </pv-data-table>

</template>

<style>
.p-paginator {
  justify-content: flex-end !important;
}

.p-paginator .p-paginator-page {
  color: #131313 !important;
  background-color: rgba(128, 128, 128, 0.2) !important;
}

.p-button-icon-style {
  border: none !important;
  color: #131313 !important;
}

.p-button-icon-style:hover,
.p-button-icon-style:focus,
.p-button-icon-style:active {
  color: #186728 !important;
  background-color: rgba(128, 128, 128, 0.2) !important; /* gris medio con transparencia */
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.btn-cancel {
  background-color: #f8f6f6 !important;
  color: #000000 !important;
  border-color: #000000 !important;
  border-radius: 5px !important;
}

.btn-cancel:hover {
  background-color: #c8c7c7 !important;
}

.btn-decline {
  background-color: #D9534F !important;
  color: white !important;
  border: none !important;
}

.btn-decline:hover {
  background-color: #bc3737 !important;
  border: none !important;
}


</style>