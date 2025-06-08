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
      sortOrder: 1, // 1 para ascendente, -1 para descendente
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
    formatDate(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    },
    openNewOrderDetailsModal(order) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
      this.$emit('open-details-modal', order);
    },
    calculatePricesAndCounts() {
      if (!this.orders.length || !this.ordersSupplies.length) return;

      const priceMap = {};
      const countMap = {};

      this.orders.forEach(order => {
        const orderId = Number(order.id);
        const orderSupplies = this.ordersSupplies.find(os => Number(os.orderId) === orderId);
        console.log("Probando lo de final price en METHODS", orderSupplies);

        if (!orderSupplies) {
          priceMap[orderId] = 0;
          countMap[orderId] = 0;
          return;
        }

        countMap[orderId] = orderSupplies.supplies?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        priceMap[orderId] = orderSupplies.supplies.reduce((sum, supplyItem) => {
          const supply = this.supplies.find(s => Number(s.id) === Number(supplyItem.supplyId)); //CORRIGE °
          const price = supply?.price || 0;

          console.log("Supply Price", price);

          return sum + price * supplyItem.quantity;
        }, 0);
      });

      this.finalPricePerOrder = priceMap;
      this.suppliesPerOrderCount = countMap;
    },
    filteredOrders() {
      let filtered = (this.orders || []).filter(order => {
        const situation = this.orderSituations.find(situation => Number(situation.id) === Number(order.situationId));
        return situation && Number(situation.id) === 1; // Filtra solo los 'Pending'
      });

      // Filtro por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => {
          const restaurantName = this.restaurantBusinessNamesPerOrder[order.id]?.toLowerCase() || '';
          const orderDate = order.date?.toLowerCase() || '';

          return restaurantName.includes(query) ||
              orderDate.includes(query)
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
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= dateLimit;
          });
        }
      }

      filtered.sort((a, b) => {
        const fieldA = new Date(a[this.sortField]);
        const fieldB = new Date(b[this.sortField]);
        return (fieldA - fieldB) * this.sortOrder;
      });

      return filtered;
    },

    toggleSort() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
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

  },
  computed: {
    restaurantBusinessNamesPerOrder() {
      const nameMap = {};

      this.orders.forEach(order => {
        const profile = this.adminRestaurantsProfiles.find(p => p.userId === order.adminRestaurantId);

        nameMap[order.id] = profile ? profile.businessName : 'Unknown Restaurant';
      });

      return nameMap;
    }
  }
}

</script>

<template>


  <!-- Sección de filtros superior -->
  <filters-section
      v-model:search-query="searchQuery"
      v-model:selected-date-range="selectedDateRange"
      :search-placeholder="'Search orders by restaurant...'"
      :sort-order="sortOrder"
      sort-label="Order Date"
      title="Orders"
      @clear-filters="resetFilters"
      @toggle-sort="toggleSort"
  >

  </filters-section>

  <!-- Empty -->
  <empty-section v-if="filteredOrders().length === 0">
    You currently have no orders received.
    <template #icon>
      <i class="pi pi-truck" style="font-size: 3rem; color: #bcbcbc;"></i>
    </template>
  </empty-section>

  <pv-data-table
      v-if="filteredOrders().length > 0"
      :rows="5"
      :rows-per-page-options="[4, 6, 8, 10]"
      :value="filteredOrders()"
      paginator
      responsive-layout="scroll"
  >
    <pv-column field="date" header="Order date">
      <template #body="{ data }">
        {{ formatDate(data.date) }}
      </template>
    </pv-column>

    <pv-column header="Restaurant Name">
      <template #body="{ data }">
        {{ restaurantBusinessNamesPerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column header="N° Requested products">
      <template #body="{ data }">
        {{ suppliesPerOrderCount[data.id] }}
      </template>
    </pv-column>

    <pv-column header="Final Price">
      <template #body="{ data }">
        S/ {{ finalPricePerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column header="Actions">
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