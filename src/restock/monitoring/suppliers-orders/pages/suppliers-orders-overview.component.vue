<script>
import NewOrders from "../components/new-orders.component.vue";
import {OrderToSupplierService} from "../../../resource/orders-to-suppliers/services/order-to-supplier.service.js";
import {
  OrderToSupplierSupplyService
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.service.js";
import {UserService} from "../../../iam/services/user.service.js";
import {ProfileService} from "../../../profiles/services/profile.service.js";
import {SupplyService} from "../../../resource/inventory/services/supply.service.js";
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import ManageNewOrders from "../components/manage-new-orders.component.vue";
import {UnitMeasurementService} from "../../../resource/inventory/services/unit-measurement.service.js";
import {
  OrderToSupplierSituationService
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-situation.service.js";
import {
  OrderToSupplierStateService
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-state.service.js";
import OrderDetails from "../components/order-details.component.vue";
import EditOrder from "../components/edit-order.component.vue";
import ApprovedOrders from "../components/approved-orders.components.vue";
import DeliveredOrders from "../components/delivered-orders.component.vue";
import {OrderToSupplierAssembler} from "../../../resource/orders-to-suppliers/services/order-to-supplier.assembler.js";
import {
  OrderToSupplierStateAssembler
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-state.assembler.js";
import {
  OrderToSupplierSituationAssembler
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-situation.assembler.js";
import {
  OrderToSupplierSupplyAssembler
} from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.assembler.js";
import {SupplyAssembler} from "../../../resource/inventory/services/supply.assembler.js";
import {UserAssembler} from "../../../iam/services/user.assembler.js";
import {ProfileAssembler} from "../../../profiles/services/profile.assembler.js";
import {UnitMeasurementAssembler} from "../../../resource/inventory/services/unit-measurement.assembler.js";
import DeleteConfirmation from "../../../../shared/components/delete.component.vue";

export default {
  name: "suppliers-orders-overview",
  components: {
    DeleteConfirmation,
    DeliveredOrders, ApprovedOrders, EditOrder, OrderDetails, ManageNewOrders, EmptySection, NewOrders
  },
  data() {
    return {
      showManageNewOrderModal: false,
      showNewOrderDetailsModal: false,
      showEditModal: false,
      showAcceptedOrderDetailsModal: false,
      selectedOrder: null,
      selectedOrderState: null,
      selectedOrderSituation: null,
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
      activeTab: 0,
      tabs: [
        {title: 'New Orders', value: 0},
        {title: 'Orders In Progress', value: 1},
        {title: 'Orders Historial', value: 2}
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
      this.orderSituations = OrderToSupplierSituationAssembler.toEntitiesFromResponse(response);
      console.log("Order Situations:", this.orderSituations);
    },

    async loadOrderStates() {
      const response = await this.orderStatesService.getAll();
      this.orderStates = OrderToSupplierStateAssembler.toEntitiesFromResponse(response);
      console.log("Order States:", this.orderStates);
    },

    async loadOrders() {
      const response = await this.ordersService.getAll();
      this.orders = OrderToSupplierAssembler.toEntitiesFromResponse(response);
      console.log("Orders:", this.orders);
    },

    async loadSupplies() {
      const response = await this.suppliesService.getAll();
      this.supplies = SupplyAssembler.toEntitiesFromResponse(response);
      console.log("Supplies:", this.supplies);
    },

    async loadRequestedSupplies() {
      const response = await this.requestedSuppliesInOrdersService.getAll();
      this.requestedSuppliesInOrders = OrderToSupplierSupplyAssembler.toEntitiesFromResponse(response);
      console.log("Requested Supplies:", this.requestedSuppliesInOrders);
    },

    async loadUsersAndProfiles() {
      const [usersResponse, profilesResponse] = await Promise.all([
        this.usersService.getByRoleId(2), // 2 is the role ID for restaurant admins
        this.profilesService.getAll()
      ]);

      this.users = UserAssembler.toEntitiesFromResponse(usersResponse);
      const allProfiles = ProfileAssembler.toEntitiesFromResponse(profilesResponse);

      this.adminRestaurantsProfiles = allProfiles.filter(profile => {
        return this.users.find(u => Number(u.id) === Number(profile.userId));

      });

      console.log("Filtered Restaurant Profiles:", this.adminRestaurantsProfiles);
    },

    async loadUnitsMeasurement() {
      const response = await this.unitsMeasurementService.getAll();
      this.unitsMeasurement = UnitMeasurementAssembler.toEntitiesFromResponse(response);
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
        const {orderId, supplyId} = orderSupply;

        if (!grouped[orderId]) {
          grouped[orderId] = new Set(); //Set para evitar duplicados
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
      this.selectedOrderState = this.orderStates.find(s => Number(s.id) === Number(order.stateId)) || {name: 'Without State'};
      this.selectedOrderSituation = this.orderSituations.find(s => Number(s.id) === Number(order.situationId)) || {name: 'Without Situation'};

      this.showEditModal = true;
    },
    openNewOrderDetailsModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];

      this.selectedOrderSituation = this.orderSituations.find(s => Number(s.id) === Number(order.situationId)) || {name: 'Without Situation'};

      const orderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.selectedOrderSupplies = orderSupplies.filter(supply => !supply.accepted);

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showNewOrderDetailsModal = true;
    },
    openOrderAcceptedDetailsModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];

      this.selectedOrderState = this.orderStates.find(s => Number(s.id) === Number(order.stateId)) || {name: 'Without State'};
      this.selectedOrderSituation = this.orderSituations.find(s => Number(s.id) === Number(order.situationId)) || {name: 'Without Situation'};

      const orderSupplies = this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.selectedOrderSupplies = orderSupplies.filter(supply => supply.accepted);

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showAcceptedOrderDetailsModal = true;
    },
    openManageNewModal(order) {
      this.selectedOrder = {...order};
      this.selectedOrderSupplies = [
        ...(this.suppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [])
      ];

      this.selectedOrderDetailedSupplies = this.detailedSuppliesGroupedByOrder.find(s => Number(s.orderId) === Number(order.id))?.supplies || [];
      this.showManageNewOrderModal = true;
    },
    async handleOrderUpdate(updateData) {
      try {
        await this.updateAcceptedOrder(updateData);

        //Reload data
        await Promise.all([
          this.loadOrders()
        ]);

        // Close modal
        this.showEditModal = false;
        this.selectedOrder = null;
        this.selectedOrderState = null;
        this.selectedOrderSituation = null;

        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order updated successfully',
          life: 3000
        });

      } catch (error) {
        console.error('Error updating order:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order',
          life: 3000
        });
      }
    },
    async handleDeclineOrder(order) {
      try {
        order.situationId = 3;

        const orderUpdatePayload = {
          id: order.id,
          date: order.date,
          estimated_ship_date: order.estimatedShipDate,
          estimated_ship_time: order.estimatedShipTime,
          description: order.description,
          admin_restaurant_id: order.adminRestaurantId,
          supplier_id: order.supplierId,
          order_to_supplier_state_id: order.stateId,
          order_to_supplier_situation_id: 3,
          requested_products_count: order.requestedProductsCount,
          total_price: order.totalPrice,
          partially_accepted: order.partiallyAccepted,
        };

        await this.ordersService.update(order.id, orderUpdatePayload);

        await this.loadOrders();

      } catch (error) {
        console.error("Error declining order:", error);
      }
    },
    async handleOrderSubmission(updateData) {

      try {
        console.log('Processing order submission:', updateData);

        await this.updateOrderDetails(updateData);

        await this.updateSuppliesAcceptance(updateData);

        await this.reloadOrderData();

        // Cerrar el modal
        this.showManageNewOrderModal = false;
        this.selectedOrder = null;
        this.selectedOrderSupplies = [];
        this.selectedOrderDetailedSupplies = [];

        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order updated successfully',
          life: 3000
        });

      } catch (error) {
        console.error('Error updating order:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order',
          life: 3000
        });
      }
    },
    async updateAcceptedOrder(updateData) {
      const orderUpdatePayload = {
        id: updateData.order.id,
        date: updateData.order.date,
        estimated_ship_date: updateData.newEstimatedShipDate,
        estimated_ship_time: updateData.newEstimatedShipTime,
        description: updateData.newDescription,
        admin_restaurant_id: updateData.order.adminRestaurantId,
        supplier_id: updateData.order.supplierId,
        order_to_supplier_state_id: updateData.newState,
        order_to_supplier_situation_id: updateData.order.situationId,
        requested_products_count: updateData.order.requestedProductsCount,
        total_price: updateData.order.totalPrice,
        partially_accepted: updateData.order.partiallyAccepted,
      };

      await this.ordersService.update(updateData.order.id, orderUpdatePayload);

      const orderIndex = this.orders.findIndex(o => Number(o.id) === Number(updateData.orderId));
      if (orderIndex !== -1) {
        this.orders[orderIndex] = {...this.orders[orderIndex], ...orderUpdatePayload};
      }
    },
    async updateOrderDetails(updateData) {
      const orderUpdatePayload = {
        id: updateData.order.id,
        date: updateData.order.date,
        estimated_ship_date: updateData.newEstimatedShipDate,
        estimated_ship_time: updateData.newEstimatedShipTime,
        description: updateData.newDescription,
        admin_restaurant_id: updateData.order.adminRestaurantId,
        supplier_id: updateData.order.supplierId,
        order_to_supplier_state_id: 1, //On Hold
        order_to_supplier_situation_id: 2, //Accepted
        requested_products_count: updateData.newRequestedProductsCount,
        total_price: updateData.newTotalPrice,
        partially_accepted: updateData.partiallyAccepted,
      };

      await this.ordersService.update(updateData.order.id, orderUpdatePayload);

      const orderIndex = this.orders.findIndex(o => Number(o.id) === Number(updateData.orderId));
      if (orderIndex !== -1) {
        this.orders[orderIndex] = {...this.orders[orderIndex], ...orderUpdatePayload};
      }
    },

    async updateSuppliesAcceptance(updateData) {
      console.log('=== DEBUG updateSuppliesAcceptance ===');
      console.log('updateData:', updateData);
      console.log('suppliesGroupedByOrder:', this.suppliesGroupedByOrder);

      const orderSupplies = this.suppliesGroupedByOrder.find(rso => Number(rso.orderId) === Number(updateData.order.id)).supplies || [];

      console.log('orderSupplies found:', orderSupplies);

      if (orderSupplies.length === 0) {
        console.error('No supplies found for order:', updateData.order.id);
        throw new Error(`No supplies found for order ${updateData.order.id}`);
      }

      const updatePromises = orderSupplies.map(async (supplyOrder) => {
        console.log('Processing supply order:', supplyOrder);

        const isAccepted = updateData.selectedSupplies.includes(Number(supplyOrder.supplyId));

        console.log(`Supply ${supplyOrder.id} is accepted: ${isAccepted}`);

        if (!supplyOrder.id) {
          console.error('Supply order missing ID:', supplyOrder);
          throw new Error(`Supply order missing ID for supply ${supplyOrder.id}`);
        }

        const updatePayload = {
          id: supplyOrder.id,
          order_to_supplier_id: supplyOrder.orderId,
          supply_id: supplyOrder.supplyId,
          quantity: supplyOrder.quantity,
          accepted: isAccepted
        };

        console.log('Updating supply with payload:', updatePayload);

        try {
          const response = await this.requestedSuppliesInOrdersService.update(supplyOrder.id, updatePayload);
          console.log('Update response:', response);

          const localIndex = this.requestedSuppliesInOrders.findIndex(rso =>
              Number(rso.id) === Number(supplyOrder.id)
          );

          if (localIndex !== -1) {
            this.requestedSuppliesInOrders[localIndex] = {
              ...this.requestedSuppliesInOrders[localIndex],
              accepted: isAccepted
            };
            console.log('Updated local data at index:', localIndex);
          }

          return response;
        } catch (error) {
          console.error(`Error updating supply ${supplyOrder.id}:`, error);
          throw error;
        }
      });

      await Promise.all(updatePromises);
      console.log('All supplies updated successfully');
    },

    async reloadOrderData() {

      await Promise.all([
        this.loadOrders(),
        this.loadRequestedSupplies()
      ]);

      // Re-agrupar supplies
      this.groupSuppliesByOrder();
      this.groupSuppliesByOrderWithDetails();
    }
  },
  computed: {
    deliveredOrders() {
      let deliveredOrders = [];
      deliveredOrders = this.orders.filter(order => {
        const state = this.orderStates.find(s => Number(s.id) === Number(order.stateId));

        return state && Number(state.id) === 4; // Filtra solo los 'Delivered'
      });

      console.log("Delivered orders:", deliveredOrders);
      return deliveredOrders;
    }
  }
};
</script>

<template>
  <pv-toast></pv-toast>
  <pv-tabs v-model:value="activeTab">
    <pv-tab-list>
      <pv-tab class="full-width-tab" v-for="tab in tabs" :key="tab.title" :value="tab.value">
        {{ tab.title }}
      </pv-tab>
    </pv-tab-list>
    <pv-tab-panels>
      <pv-tab-panel :value="0">
        <new-orders
            @open-modal="openManageNewModal"
            @open-details-modal="openNewOrderDetailsModal"
            @decline-order="handleDeclineOrder($event)"
            :order-situations="orderSituations"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="orders"
            :supplies="supplies"
        ></new-orders>
      </pv-tab-panel>
      <pv-tab-panel :value="1">
        <approved-orders
            @open-edit-modal="openEditModal"
            @open-details-modal="openOrderAcceptedDetailsModal"
            @delete-order="handleDeclineOrder($event)"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders="orders"
            :order-states="orderStates"
            :order-situations="orderSituations">
        </approved-orders>
      </pv-tab-panel>
      <pv-tab-panel :value="2">
        <delivered-orders
            @open-details-modal="openOrderAcceptedDetailsModal"
            :detailed-supplies-per-order="detailedSuppliesGroupedByOrder"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="deliveredOrders">
        </delivered-orders>
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
      @submit-order="handleOrderSubmission($event)"
  />

  <edit-order
      v-model="showEditModal"
      :order="selectedOrder"
      :situation="selectedOrderSituation"
      :state="selectedOrderState"
      @update:modelValue="showEditModal = $event"
      @submit-order="handleOrderUpdate($event)"
  />

  <order-details
      v-model="showAcceptedOrderDetailsModal"
      :order="selectedOrder"
      :detailed-supplies-per-order="selectedOrderDetailedSupplies"
      :supplies-per-order="selectedOrderSupplies"
      :units-measurement="unitsMeasurement"
      :order-situation="selectedOrderSituation"
      :order-state="selectedOrderState"
      :admin-restaurants-profiles="adminRestaurantsProfiles"
      :hide-state="false"
      @update:modelValue="showAcceptedOrderDetailsModal = $event"
  />

  <order-details
      v-model="showNewOrderDetailsModal"
      :order="selectedOrder"
      :detailed-supplies-per-order="selectedOrderDetailedSupplies"
      :supplies-per-order="selectedOrderSupplies"
      :units-measurement="unitsMeasurement"
      :order-situation="selectedOrderSituation"
      :admin-restaurants-profiles="adminRestaurantsProfiles"
      :hide-state="true"
      @update:modelValue="showNewOrderDetailsModal = $event"
  />

  <pv-confirm-dialog :closable="false"/>
</template>

<style scoped>

.full-width-tab[aria-selected="true"] {
  border: 2px solid #131313 !important;
  background: linear-gradient(135deg, rgba(100, 35, 0, 0.06), rgba(128, 58, 0, 0.06)) !important;
  color: #131313 !important;
  box-shadow: inset 0 2px 4px rgba(225, 144, 38, 0.1) !important;
  font-weight: bold !important;
}

</style>