<script>

import EmptySection from "../../../../shared/components/empty-section.component.vue";
import ManageNewOrders from "./manage-new-orders.component.vue";
import {ConfirmDialog, useConfirm} from "primevue";

export default {
  name: "new-orders",
  components: {ManageNewOrders, EmptySection},
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
  emits: ['openModal'],
  data() {
    return {
      finalPricePerOrder: {},
      suppliesPerOrderCount: {},
      selectedOrder: null,
      showManageModal: false,
      confirm: null,
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

        countMap[orderId] = orderSupplies.supplies?.length || 0;

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

      return (this.orders || []).filter(order => {
        const situation = this.orderSituations.find(situation => Number(situation.id) === Number(order.situationId));
        return situation && Number(situation.id) === 1; // Filtra solo los 'Approved'
      });
    },
    manageNewOrder(order) {
      this.selectedOrder = order;
      this.showManageModal = true;
      this.$emit('open-modal', order);
    },
    declineOrder(order) {
      // Aquí lógica para rechazar el pedido
      // Por ejemplo, hacer una llamada a la API para actualizar el estado del pedido
    },
    confirmDecline(order) {
      this.confirm.require({
        message: 'Are you sure you want to reject this order?',
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
  mounted() {
    this.confirm = useConfirm();
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
    You currently have no orders received.
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
  >
    <pv-column field="date" header="Order date">
      <template #body="{ data }">
        {{ data.date }}
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
            @click="getDetails(data)"
            text
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-check text-base"
            @click="manageNewOrder(data)"
            text
        />

        <pv-button
            class="p-button-icon-style"
            icon="pi pi-times text-base"
            @click="confirmDecline(data)"
            text
        />


      </template>
    </pv-column>

  </pv-data-table>

  <pv-confirm-dialog></pv-confirm-dialog>
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
.p-button-icon-style:active{
  color: #186728 !important;
  background-color: rgba(128, 128, 128, 0.2) !important; /* gris medio con transparencia */
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>