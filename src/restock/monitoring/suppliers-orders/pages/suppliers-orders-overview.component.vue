<script>
import NewOrders from "../components/new-orders.component.vue";
import {OrderToSupplierService} from "../../../resource/orders-to-suppliers/services/order-to-supplier.service.js";
import { OrderToSupplierSupplyService } from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.service.js";
import {OrderToSupplier} from "../../../resource/orders-to-suppliers/model/order-to-supplier.entity.js";
import {OrderToSupplierSupply} from "../../../resource/orders-to-suppliers/model/order-to-supplier-supply.entity.js";
import {UserService} from "../../../iam/services/user.service.js";
import {ProfileService} from "../../../profiles/services/profile.service.js";
import {Profile} from "../../../profiles/model/profile.entity.js";
import {User} from "../../../iam/model/user.entity.js";
import {SupplyService} from "../../../resource/inventory/services/supply.service.js";
import {Supply} from "../../../resource/inventory/model/supply.entity.js";
import EmptySection from "../../../../shared/components/empty-section.component.vue";

export default {
  name: "suppliers-orders-overview",
  components: {EmptySection, NewOrders},
  data() {
    return {
      orders: [],
      requestedSuppliesInOrders: [],
      users: [],
      supplies: [],
      adminRestaurantsProfiles: [],
      suppliesGroupedByOrder: [],
      tabs: [
        { title: 'New Orders', value: 0, content: 'Este es el resumen del pedido.' },
        { title: 'Your Orders', value: 1, content: 'Aquí van los detalles del pedido.' },
        { title: 'Orders Historial', value: 2, content: 'Historial de cambios del pedido.' }
      ]
    };
  },
  created() {
    this.ordersService = new OrderToSupplierService();
    this.requestedSuppliesInOrdersService = new OrderToSupplierSupplyService();
    this.usersService = new UserService();
    this.profilesService = new ProfileService();
    this.suppliesService = new SupplyService();

    // 2. Get supplies requested
    this.requestedSuppliesInOrdersService.getAll()
        .then(response => {
          // 1. Convert each element to class OrderToSupplierSupply
          this.requestedSuppliesInOrders = response.data.map(s => new OrderToSupplierSupply(s));
          console.log("Supplies orders:", this.requestedSuppliesInOrders);

          // 2. Grouped per por order_to_supplier_id
          const grouped = {};

          this.requestedSuppliesInOrders.forEach(orderSupply => {
            const orderId = orderSupply.orderId;
            if (!grouped[orderId]) {
              grouped[orderId] = [];
            }
            grouped[orderId].push(orderSupply);
          });

          // 3. Convert the object to an array of arrays with [key, arr of OrderToSupplierSupply]
          this.suppliesGroupedByOrder = Object.entries(grouped).map(([orderId, supplies]) => ({
            orderId,
            supplies
          }));

          console.log("Supplies grouped by order:", this.suppliesGroupedByOrder);
        })
        .catch(error => console.error("Supply error:", error));

    // 4. Get general supplies
    this.suppliesService.getAll()
        .then(response => {
          this.supplies = response.data.map(supply => new Supply(supply));
          console.log("Supplies:", this.supplies);
        })
        .catch(error => console.error("Supplies error:", error));

    // 1. Get orders
    this.ordersService.getAll()
        .then(response => {
          this.orders = response.data.map(order => new OrderToSupplier(order));
          console.log("Orders:", this.orders);
        })
        .catch(error => console.error("Orders error:", error));

    // 3. Load users, roles, and profiles together and then filter profiles per role name 'restaurant'
    Promise.all([
      this.usersService.getAll(),
      this.profilesService.getAll()
    ])
        .then(([usersResponse, profilesResponse]) => {
          this.users = usersResponse.data.map(u => new User(u));
          const allProfiles = profilesResponse.data.map(p => new Profile(p));

          // Here we merge with users and roles to identify the profile role
          this.adminRestaurantsProfiles = allProfiles.filter(profile => {
            const user = this.users.find(u => Number(u.id) === Number(profile.userId));
            console.log("Profile:", profile.userId, "Users", user.id);
            return user?.roleId === 2;

          });
          console.log("Filtered Restaurant Profiles:", this.adminRestaurantsProfiles);
        })
        .catch(error => console.error("Profiles error:", error));



  }
}
</script>

<template>

  <pv-tabs value="0">
    <pv-tab-list>
      <pv-tab v-for="tab in tabs" :key="tab.title" :value="tab.value">
        {{ tab.title }}
      </pv-tab>
    </pv-tab-list>
    <pv-tab-panels>
      <pv-tab-panel :value="0">
        <new-orders
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="orders"
            :supplies="supplies"
        ></new-orders>
      </pv-tab-panel>
      <pv-tab-panel>
        {{ tabs[1].content }}
      </pv-tab-panel>
      <pv-tab-panel>
        {{ tabs[2].content }}
      </pv-tab-panel>
    </pv-tab-panels>
  </pv-tabs>

</template>

<style scoped>

</style>