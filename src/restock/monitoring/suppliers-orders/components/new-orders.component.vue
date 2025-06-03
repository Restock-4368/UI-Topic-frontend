<script>

export default {
  name: "new-orders",
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
    },
    supplies: {
      type: Array,
      required: true,
    }
  },
  // data() {
  //   return {
  //     orders: [
  //       { id: 1, date: "2024-07-01", adminRestaurantId: 101 },
  //       { id: 2, date: "2024-07-02", adminRestaurantId: 102 },
  //     ],
  //     ordersSupplies: [
  //       { orderId: 1, supply_id: 201, quantity: 3 },
  //       { orderId: 1, supply_id: 202, quantity: 2 },
  //       { orderId: 2, supply_id: 201, quantity: 1 },
  //     ],
  //     supplies: [
  //       { id: 201, name: "Tomatoes", price: 2.5 },
  //       { id: 202, name: "Lettuce", price: 1.0 },
  //     ],
  //     adminRestaurantsProfiles: [
  //       { user_id: 101, business_name: "El Buen Sabor" },
  //       { user_id: 102, business_name: "La Picantería Feliz" },
  //     ],
  //   };
  // },
  computed: {
    suppliesPerOrder() {
      const result = {};
      this.orders.forEach(order => {
        result[order.id] = this.ordersSupplies.filter(os => os.orderId === order.id);
      });
      return result;
    },
    suppliesPerOrderCount() {
      const countMap = {};

      this.orders.forEach(order => {
        const supplies = this.suppliesPerOrder[order.id] || [];
        countMap[order.id] = supplies.length;
      });

      return countMap;
    },
    restaurantBusinessNamesPerOrder() {
      const nameMap = {};

      this.orders.forEach(order => {
        const profile = this.adminRestaurantsProfiles.find(p => p.user_id === order.adminRestaurantId);
        nameMap[order.id] = profile ? profile.business_name : 'Unknown Restaurant';
      });

      return nameMap;
    },
    finalPricePerOrder() {
      const pricePerOrder = {};

      this.orders.forEach(order => {
        const suppliesForOrder = this.suppliesPerOrder[order.id] || [];

        pricePerOrder[order.id] = suppliesForOrder.reduce((sum, os) => {
          const supply = this.supplies.find(s => s.id === os.supply_id);
          const price = supply?.price || 0;
          return sum + price * os.quantity;
        }, 0);
      });

      return pricePerOrder;
    },
  }
}

</script>

<template>
  <pv-data-table
      :value="orders"
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
        S/ {{ finalPricePerOrder[data.id].toFixed(2) }}
      </template>
    </pv-column>

    <pv-column header="Details">
      <template #body="{ data }">
        <pv-button
            class="p-button-icon-style"
            icon="pi pi-book text-base"
            @click="getDetails(data)"
            text
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
.p-button-icon-style:active{
  color: #186728 !important;
  background-color: rgba(128, 128, 128, 0.2) !important; /* gris medio con transparencia */
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>