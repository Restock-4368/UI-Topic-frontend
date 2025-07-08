<script>
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import FiltersSection from "./filters-section.vue";

export default {
  name: "approved-orders",
  components: {FiltersSection, EmptySection},
  props: {
    orderSituations: {
      type: Array,
      required: true,
    },
    orderStates: {
      type: Array,
      required: true,
    },
    orders: {
      type: Array,
      required: true,
    },
    adminRestaurantsProfiles: {
      type: Array,
      required: true,
    }
  },
  emits: ['open-edit-modal', 'open-details-modal', 'delete-order'],
  data() {
    return {
      selectedOrder: null,
      showEditModal: false,
      showDetailsModal: false,
      confirm: null,
      // Filters
      searchQuery: '',
      selectedStatus: null,
      selectedDateRange: null,
      sortField: 'date',
      sortOrder: 1, // 1 to increase, -1 to descendent
    }
  },
  methods: {
    resetFilters() {
      this.searchQuery = '';
      this.selectedDateRange = null;
    },
    filteredOrders() {
      let filtered = (this.orders || []).filter(order => {
        const situation = this.orderSituations.find(situation => Number(situation.id) === Number(order.situationId));
        const state = this.getOrderState(order);
        return situation && Number(situation.id) === 2 && state && Number(state.id) !== 4; // Filtra solo los 'Approved' y no 'Delivered'
      });

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => {
          const restaurantName = this.restaurantBusinessNamesPerOrder[order.id]?.toLowerCase() || '';
          const orderDate = order.date?.toLowerCase() || '';
          const state = this.getOrderState(order).name?.toLowerCase() || '';

          return restaurantName.includes(query) ||
              orderDate.includes(query) ||
              state.includes(query);
        });
      }

      // State filter
      if (this.selectedStatus) {
        filtered = filtered.filter(order => {
          const state = this.getOrderState(order);
          return state.name?.toLowerCase() === this.selectedStatus;
        });
      }

      // Date Range filter
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
    getOrderState(order) {
      return this.orderStates.find(state => Number(state.id) === Number(order.stateId)) || { name: 'Without State' };
    },
    rowClass(order) {
      const state = this.getOrderState(order);
      if (!state || !state.name) return '';

      switch (state.name.toLowerCase()) {
        case 'on hold':
          return 'row-on-hold';
        case 'on the way':
          return 'row-on-the-way';
        case 'delivered':
          return 'row-delivered';
        case 'preparing':
          return 'row-preparing';
        default:
          return '';
      }
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
    openEditModal(order) {
      this.selectedOrder = order;
      this.showEditModal = true;
      this.$emit('open-edit-modal', order);
    },
    openOrderAcceptedDetailsModal(order) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
      this.$emit('open-details-modal', order);
    },
    deleteOrder(order) {
      this.$emit('delete-order', order);
    },
    confirmDelete(order) {
      this.$confirm.require({
        message: this.$t('supplier-orders.cancel.message'),
        header: this.$t('supplier-orders.cancel.title'),
        acceptLabel: this.$t('supplier-orders.cancel.buttons.confirm'),
        rejectLabel: this.$t('supplier-orders.cancel.buttons.cancel'),
        rejectClass: 'btn-cancel',
        acceptClass: 'btn-decline',
        accept: () => {
          this.deleteOrder(order);
        },
        reject: () => {
          close();
        }
      });
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },

  },
  computed: {
    statusOptions(){
      return [
        { label: this.$t('supplier-orders.state.on-hold'), value: 'on hold' },
        { label: this.$t('supplier-orders.state.preparing'), value: 'preparing' },
        { label: this.$t('supplier-orders.state.on-the-way'), value: 'on the way' }
      ]
    },
    restaurantBusinessNamesPerOrder() {
      const nameMap = {};

      this.orders.forEach(order => {
        const profile = this.adminRestaurantsProfiles.find(p => p.user_id === order.adminRestaurantId);

        nameMap[order.id] = profile ? profile.business.name : 'Unknown Restaurant';
      });

      return nameMap;
    }
  },
  watch: {
    orders: {
      handler() {
      },
      immediate: true,
      deep: true,
    }
  },
}
</script>

<template>

  <filters-section
      title="Orders"
      @clear-filters="resetFilters"
      v-model:search-query="searchQuery"
      v-model:selected-date-range="selectedDateRange"
      :sort-order="sortOrder"
      @toggle-sort="toggleSort"
  >
    <!-- Slot to personalize filters -->
    <template #filters>
      <!-- State filter -->
      <pv-dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Status"
          class="filter-dropdown"
          :show-clear="true"
      />
    </template>
  </filters-section>

  <!-- Empty -->
  <empty-section v-if="filteredOrders().length === 0">
    {{ $t('supplier-orders.empty.accepted-orders') }}
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

    <pv-column :header="$t('supplier-orders.state.title')">
      <template #body="{ data }">
        {{ getOrderState(data).name }}
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
        {{ data.requestedProductsCount }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.final-price')">
      <template #body="{ data }">
        S/ {{ data.totalPrice }}
      </template>
    </pv-column>

    <pv-column :header="$t('supplier-orders.table.actions')">
      <template #body="{ data }">
        <pv-button
            class="p-button-icon-style"
            icon="pi pi-book text-base"
            @click="openOrderAcceptedDetailsModal(data)"
            text
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-pencil text-base"
            @click="openEditModal(data)"
            text
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-trash text-base"
            @click="confirmDelete(data)"
            text
        />


      </template>
    </pv-column>

  </pv-data-table>

</template>

<style>
.row-on-hold {
  background-color: rgba(177, 123, 70, 0.3) !important; /* amarillo claro */
}

.row-preparing {
  background-color: rgba(214, 185, 26, 0.3) !important; /* verde muy claro */
}

.row-on-the-way {
  background-color: rgba(69, 130, 200, 0.3) !important; /* azul claro */
}

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
}
</style>