<script>
import EmptySection from "../../../../shared/components/empty-section.component.vue";

export default {
  name: "manage-accepted-orders",
  components: {EmptySection},
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
    }
  },
  methods: {
    filteredOrders() {
      return (this.orders || []).filter(order => {
        const situation = this.orderSituations.find(situation => Number(situation.id) === Number(order.situationId));
        return situation && Number(situation.id) === 2; // Filtra solo los 'Approved'
      });
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


</style>