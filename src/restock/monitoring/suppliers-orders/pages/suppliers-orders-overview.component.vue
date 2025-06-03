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
import {
  OrderToSupplierSituationService
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-situation.service.js";
import {
  OrderToSupplierStateService
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-state.service.js";
import {OrderToSupplierSituation} from "../../../resource/orders-to-suppliers/model/order-to-supplier-situation.vo.js";
import {OrderToSupplierState} from "../../../resource/orders-to-suppliers/model/order-to-supplier-state.vo.js";
import ApprovedOrdersComponents from "../components/approved-orders.components.vue";
import OrderDetails from "../components/order-details.component.vue";
import EditOrder from "../components/edit-order.component.vue";

export default {
  name: "suppliers-orders-overview",
  components: {EditOrder, OrderDetails, ManageAcceptedOrders: ApprovedOrdersComponents, ManageNewOrders, EmptySection, NewOrders},
  data() {
    return {
      showManageNewOrderModal: false,
      showEditModal: false,
      showAcceptedOrderDetailsModal: false,
      selectedOrder: null,
      selectedOrderSupplies: [],
      selectedOrderDetailedSupplies: [],
      orders: [],
      orderSituations: [],
      orderStates: [],
      requestedSuppliesInOrders: [],
      users: [],
      supplies: [],
      adminRestaurantsProfiles: [],
      suppliesGroupedByOrder: [],
      detailedSuppliesGroupedByOrder: [],
      unitsMeasurement: [],
      tabs: [
        { title: 'New Orders', value: 0, content: 'Este es el resumen del pedido.' },
        { title: 'Pending Orders', value: 1, content: 'Aquí van los detalles del pedido.' },
        { title: 'Orders Historial', value: 2, content: 'Historial de cambios del pedido.' }
      ]
    };
  },
  async created() {
    this.initServices();

    try {
      await Promise.all([
          this.loadOrderSituations(),
          this.loadOrderStates(),
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
      this.orderSituationsService = new OrderToSupplierSituationService();
      this.orderStatesService = new OrderToSupplierStateService();
      this.ordersService = new OrderToSupplierService();
      this.requestedSuppliesInOrdersService = new OrderToSupplierSupplyService();
      this.usersService = new UserService();
      this.profilesService = new ProfileService();
      this.suppliesService = new SupplyService();
      this.unitsMeasurementService = new UnitMeasurementService();
    },

    async loadOrderSituations() {
      const response = await this.orderSituationsService.getAll();
      this.orderSituations = response.data.map(s => new OrderToSupplierSituation(s));
      console.log("Order Situations:", this.orderSituations);
    },

    async loadOrderStates() {
      const response = await this.orderStatesService.getAll();
      this.orderStates = response.data.map(s => new OrderToSupplierState(s));
      console.log("Order States:", this.orderStates);
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
            this.supplies.find(supply => Number(supply.id) === Number(supplyId))
        ).filter(Boolean); // Filtramos null por si hay supplyId sin match

        return {
          orderId,
          supplies
        };
      });

      console.log("Grouped supplies with full details by order:", this.detailedSuppliesGroupedByOrder);
    },

    openEditModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showEditModal = true;
    },
    openOrderAcceptedDetailsModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showAcceptedOrderDetailsModal = true;
    },
    openManageNewModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showManageNewOrderModal = true;
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
            @open-modal="openManageNewModal"
            :order-situations="orderSituations"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="orders"
            :supplies="supplies"
        ></new-orders>
      </pv-tab-panel>
      <pv-tab-panel :value="1">
        <manage-accepted-orders
            @open-edit-modal="openEditModal"
            @open-details-modal="openOrderAcceptedDetailsModal"
            :detailed-supplies-per-order="detailedSuppliesGroupedByOrder"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="orders"
            :order-states="orderStates"
            :order-situations="orderSituations">

        </manage-accepted-orders>
      </pv-tab-panel>
      <pv-tab-panel>
        {{ tabs[2].content }}
      </pv-tab-panel>
    </pv-tab-panels>
  </pv-tabs>

  <manage-new-orders
      v-model="showManageNewOrderModal"
      :order="selectedOrder"
      :detailed-supplies-per-order="selectedOrderDetailedSupplies"
      :supplies-per-order="selectedOrderSupplies"
      :units-measurement="unitsMeasurement"
      @update:modelValue="showManageNewOrderModal = $event"
  />

  <edit-order
      v-model="showEditModal"
      @update:modelValue="showEditModal = $event"
      />

  <order-details
      v-model="showAcceptedOrderDetailsModal"
      @update:modelValue="showAcceptedOrderDetailsModal = $event"
  />
</template>

<style scoped>

</style>