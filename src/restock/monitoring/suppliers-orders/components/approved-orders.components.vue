<script>
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import FiltersSection from "./filters-section.vue";

export default {
  name: "manage-accepted-orders",
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
    ordersSupplies: {
      type: Array,
      required: true,
    },
    adminRestaurantsProfiles: {
      type: Array,
      required: true,
    },
    detailedSuppliesPerOrder: {
      type: Array,
      required: true,
    }
  },
  emits: ['open-edit-modal', 'open-details-modal'],
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
      sortOrder: 1, // 1 para ascendente, -1 para descendente
      statusOptions: [
        { label: 'All Status', value: null },
        { label: 'On Hold', value: 'on hold' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'On the Way', value: 'on the way' },
        { label: 'Delivered', value: 'delivered' }
      ],
      dateRangeOptions: [
        { label: 'All Dates', value: null },
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'Last 3 months', value: '3months' }
      ]
    }
  },
  methods: {
    filteredOrders() {
      let filtered = (this.orders || []).filter(order => {
        const situation = this.orderSituations.find(situation => Number(situation.id) === Number(order.situationId));
        return situation && Number(situation.id) === 2; // Filtra solo los 'Approved'
      });

      // Filtro por búsqueda
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

      // Filtro por estado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => {
          const state = this.getOrderState(order);
          return state.name?.toLowerCase() === this.selectedStatus;
        });
      }

      // Filtro por rango de fecha
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

      return filtered;
    },
    getOrderState(order) {
      return this.orderStates.find(state => Number(state.id) === Number(order.stateId)) || { name: 'Without State' };
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
      const state = this.getOrderState(order);
      console.log("Entre a ROWCLASS estado:", state);
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
    declineOrder(order) {
      // Implementa la lógica para rechazar la orden
      // Aquí podrías hacer una llamada a la API para actualizar el estado de la orden
    },
    confirmDecline(order) {
      this.$confirm.require({
        message: 'Are you sure you want to delete and cancel this order?',
        header: 'Confirm action',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, decline',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.declineOrder(order); // asegúrate de tener esta función implementada
        },
        reject: () => {
          // Opcional: acción al cancelar
        }
      });
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },
    downloadHistory() {
      // Implementar lógica de descarga
      console.log('Downloading order history...');
      // Aquí puedes generar un CSV o Excel con los datos filtrados
      this.generateCSV();
    },
    generateCSV() {
      const orders = this.filteredOrders();
      let csv = 'Order Date,State,Ship Date,Restaurant Name,Requested Products,Final Price\n';

      orders.forEach(order => {
        const restaurantName = this.restaurantBusinessNamesPerOrder[order.id] || 'Unknown';
        const state = this.getOrderState(order).name || 'Without State';
        const shipDate = order.estimatedShipDate || 'Not set';
        const requestedCount = this.requestedSuppliesCount(order);

        csv += `${order.date},${state},${shipDate},${restaurantName},${requestedCount},S/ ${order.totalPrice}\n`;
      });

      // Crear y descargar el archivo
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders_history.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
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
      title="Orders"
      v-model:search-query="searchQuery"
      :search-placeholder="'Search orders by restaurant...'"
      :sort-order="sortOrder"
      sort-label="Order Date"
      @toggle-sort="toggleSort"
  >
    <!-- Slot para filtros específicos -->
    <template #filters>
      <!-- Filtro de estado -->
      <pv-dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Status"
          class="filter-dropdown"
      />

      <!-- Filtro de rango de fecha -->
      <pv-dropdown
          v-model="selectedDateRange"
          :options="dateRangeOptions"
          option-label="label"
          option-value="value"
          placeholder="Date range"
          class="filter-dropdown"
      />
    </template>

    <!-- Slot para acciones del lado derecho -->
    <template #actions>
      <pv-button
          @click="downloadHistory"
          class="download-button"
          severity="success"
      >
        <i class="pi pi-download"></i>
        DOWNLOAD HISTORY
      </pv-button>
    </template>

  </filters-section>

  <!-- Empty -->
  <empty-section v-if="filteredOrders().length === 0">
    You currently have no orders approved.
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
    <pv-column field="date" header="Order date">
      <template #body="{ data }">
        {{ data.date }}
      </template>
    </pv-column>

    <pv-column header="State">
      <template #body="{ data }">
        {{ getOrderState(data).name }}
      </template>
    </pv-column>

    <pv-column header="Ship date">
      <template #body="{ data }">
        {{ data.estimatedShipDate ? data.estimatedShipDate : 'Not set' }}
      </template>
    </pv-column>

    <pv-column header="Restaurant Name">
      <template #body="{ data }">
        {{ restaurantBusinessNamesPerOrder[data.id] }}
      </template>
    </pv-column>

    <pv-column header="N° Requested products">
      <template #body="{ data }">
        {{ requestedSuppliesCount(data) }}
      </template>
    </pv-column>

    <pv-column header="Final Price">
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

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-pencil text-base"
            @click="openEditModal(data)"
            text
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-trash text-base"
            @click="confirmDecline(data)"
            text
        />


      </template>
    </pv-column>

  </pv-data-table>

  <pv-confirm-dialog></pv-confirm-dialog>
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
/* Estilos para los dropdowns */
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