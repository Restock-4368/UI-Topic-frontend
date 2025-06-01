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
import ManageNewOrders from "../components/manage-new-orders.component.vue";
import {UnitMeasurementService} from "../../../resource/inventory/services/unit-measurement.service.js";
import {UnitMeasurement} from "../../../resource/inventory/model/unit-measurement.entity.js";

export default {
  name: "suppliers-orders-overview",
  components: {ManageNewOrders, EmptySection, NewOrders},
  data() {
    return {
      showModal: false,
      selectedOrder: null,
      selectedOrderSupplies: [],
      selectedOrderDetailedSupplies: [],
      orders: [],
      requestedSuppliesInOrders: [],
      users: [],
      supplies: [],
      adminRestaurantsProfiles: [],
      suppliesGroupedByOrder: [],
      detailedSuppliesGroupedByOrder: [],
      unitsMeasurement: [],
      tabs: [
        { title: 'New Orders', value: 0, content: 'Este es el resumen del pedido.' },
        { title: 'Your Orders', value: 1, content: 'Aquí van los detalles del pedido.' },
        { title: 'Orders Historial', value: 2, content: 'Historial de cambios del pedido.' }
      ]
    };
  },
  async created() {
    this.initServices();

    try {
      await Promise.all([
        this.loadOrders(),
        this.loadSupplies(),
        this.loadRequestedSupplies(),
        this.loadUsersAndProfiles(),
        this.loadUnitsMeasurement(),
      ]);

      this.groupSuppliesByOrder();
      this.groupSuppliesByOrderWithDetails();

    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  },
  methods: {
    initServices() {
      this.ordersService = new OrderToSupplierService();
      this.requestedSuppliesInOrdersService = new OrderToSupplierSupplyService();
      this.usersService = new UserService();
      this.profilesService = new ProfileService();
      this.suppliesService = new SupplyService();
      this.unitsMeasurementService = new UnitMeasurementService();
    },

    async loadOrders() {
      const response = await this.ordersService.getAll();
      this.orders = response.data.map(order => new OrderToSupplier(order));
      console.log("Orders:", this.orders);
    },

    async loadSupplies() {
      const response = await this.suppliesService.getAll();
      this.supplies = response.data.map(s => new Supply(s));
      console.log("Supplies:", this.supplies);
    },

    async loadRequestedSupplies() {
      const response = await this.requestedSuppliesInOrdersService.getAll();
      this.requestedSuppliesInOrders = response.data.map(s => new OrderToSupplierSupply(s));
      console.log("Requested Supplies:", this.requestedSuppliesInOrders);
    },

    async loadUsersAndProfiles() {
      const [usersResponse, profilesResponse] = await Promise.all([
        this.usersService.getAll(),
        this.profilesService.getAll()
      ]);

      this.users = usersResponse.data.map(u => new User(u));
      const allProfiles = profilesResponse.data.map(p => new Profile(p));

      this.adminRestaurantsProfiles = allProfiles.filter(profile => {
        const user = this.users.find(u => Number(u.id) === Number(profile.userId));
        return user?.roleId === 2;
      });

      console.log("Filtered Restaurant Profiles:", this.adminRestaurantsProfiles);
    },

    async loadUnitsMeasurement() {
      const response = await this.unitsMeasurementService.getAll();
      this.unitsMeasurement = response.data.map(s => new UnitMeasurement(s));
      console.log("Units measurement:", this.unitsMeasurement);
    },

    groupSuppliesByOrder() {
      const grouped = {};

      this.requestedSuppliesInOrders.forEach(orderSupply => {
        const orderId = orderSupply.orderId;
        if (!grouped[orderId]) {
          grouped[orderId] = [];
        }
        grouped[orderId].push(orderSupply);
      });

      this.suppliesGroupedByOrder = Object.entries(grouped).map(([orderId, supplies]) => ({
        orderId,
        supplies
      }));

      console.log("Supplies grouped by order:", this.suppliesGroupedByOrder);

    },

    groupSuppliesByOrderWithDetails() {
      const grouped = {};

      this.requestedSuppliesInOrders.forEach(orderSupply => {
        const { orderId, supplyId } = orderSupply;

        if (!grouped[orderId]) {
          grouped[orderId] = new Set(); // Usamos Set para evitar duplicados
        } 
        grouped[orderId].add(supplyId);
      });

      // Convertimos el resultado a array de objetos con supplies completos
      this.detailedSuppliesGroupedByOrder = Object.entries(grouped).map(([orderId, supplyIdsSet]) => {
        const supplies = [...supplyIdsSet].map(supplyId =>
            this.supplies.find(supply => supply.id === supplyId)
        ).filter(Boolean); // Filtramos null por si hay supplyId sin match

        return {
          orderId,
          supplies
        };
      });

      console.log("Grouped supplies with full details by order:", this.detailedSuppliesGroupedByOrder);
    },

    openManageModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      console.log("Selected order supplies ESTO DEVUEVLO 1:", this.selectedOrderSupplies);
      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      console.log("Selected order supplies ESTO DEVUEVLO 2:", this.selectedOrderDetailedSupplies);
      this.showModal = true;
    }
  }
};
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
            @open-modal="openManageModal"
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

  <manage-new-orders
      v-model="showModal"
      :order="selectedOrder"
      :detailed-supplies-per-order="selectedOrderDetailedSupplies"
      :supplies-per-order="selectedOrderSupplies"
      :units-measurement="unitsMeasurement"
      :modelValue="showModal"
      @update:modelValue="showModal = $event"
  />

</template>

<style scoped>

</style>