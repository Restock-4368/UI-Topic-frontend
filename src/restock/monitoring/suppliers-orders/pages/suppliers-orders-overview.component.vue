<script>
import NewOrders from "../components/new-orders.component.vue";
import {OrderToSupplierService} from "../../../resource/orders-to-suppliers/services/order-to-supplier.service.js";
import { OrderToSupplierSupplyService } from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.service.js";
import {OrderToSupplier} from "../../../resource/orders-to-suppliers/model/order-to-supplier.entity.js";
import {OrderToSupplierSupply} from "../../../resource/orders-to-suppliers/model/order-to-supplier-supply.entity.js";
import {UserService} from "../../../iam/services/user.service.js";
import {RoleService} from "../../../iam/services/role.service.js";
import {ProfileService} from "../../../profiles/services/profile.service.js";
import {Profile} from "../../../profiles/model/profile.entity.js";
import {Role} from "../../../iam/model/role.entity.js";
import {User} from "../../../iam/model/user.entity.js";
import {SupplyService} from "../../../resource/inventory/services/supply.service.js";
import {Supply} from "../../../resource/inventory/model/supply.entity.js";

export default {
  name: "suppliers-orders-overview",
  components: {NewOrders},
  data() {
    return {
      orders: [],
      requestedSuppliesInOrders: [],
      users: [],
      roles: [],
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
    this.suppliesService = new OrderToSupplierSupplyService();
    this.usersService = new UserService();
    this.rolesService = new RoleService();
    this.profilesService = new ProfileService();
    this.suppliesService = new SupplyService();

    // 1. Get orders
    this.ordersService.getAll()
        .then(response => {
          this.orders = response.data.map(order => new OrderToSupplier(order));
          console.log("Orders:", this.orders);
        })
        .catch(error => console.error("Orders error:", error));

    // 2. Get supplies requested
    this.suppliesService.getAll()
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

          // 3. Convert the object to an array of arrays
          this.suppliesGroupedByOrder = Object.values(grouped);

          console.log("Supplies grouped by order:", this.suppliesGroupedByOrder);
        })
        .catch(error => console.error("Supply error:", error));

    // 3. Load users, roles, and profiles together and then filter profiles per role name 'restaurant'
    Promise.all([
      this.usersService.getAll(),
      this.rolesService.getAll(),
      this.profilesService.getAll()
    ])
        .then(([usersResponse, rolesResponse, profilesResponse]) => {
          this.users = usersResponse.data.map(u => new User(u));
          this.roles = rolesResponse.data.map(r => new Role(r));
          const allProfiles = profilesResponse.data.map(p => new Profile(p));

          this.adminRestaurantsProfiles = allProfiles.filter(profile => {
            const user = this.users.find(u => u.id === profile.user_id);
            const role = this.roles.find(r => r.id === user?.role_id);
            return role?.name === 'restaurant';
          });

          console.log("Users:", this.users);
          console.log("Roles:", this.roles);
          console.log("Filtered Restaurant Profiles:", this.adminRestaurantsProfiles);
        })
        .catch(error => console.error("Users/Roles/Profiles error:", error));

    // 4. Get general supplies
    this.suppliesService.getAll()
        .then(response => {
          this.supplies = response.data.map(supply => new Supply(supply));
          console.log("Supplies:", this.supplies);
        })
        .catch(error => console.error("Supplies error:", error));
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