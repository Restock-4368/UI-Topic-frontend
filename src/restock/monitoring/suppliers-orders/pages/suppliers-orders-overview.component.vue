<script>
import NewOrders from "../components/new-orders.component.vue";
import EmptySection from "../../../../shared/components/empty-section.component.vue";
import ManageNewOrders from "../components/manage-new-orders.component.vue";
import OrderDetails from "../components/order-details.component.vue";
import EditOrder from "../components/edit-order.component.vue";
import ApprovedOrders from "../components/approved-orders.components.vue";
import DeliveredOrders from "../components/delivered-orders.component.vue";
import DeleteConfirmation from "../../../../shared/components/delete.component.vue";

// Services
import { OrderToSupplierService } from "../../../resource/orders-to-suppliers/services/order-to-supplier.service.js";
import { OrderToSupplierSupplyService } from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.service.js";
import { OrderToSupplierSituationService } from "../../../resource/orders-to-suppliers/services/order-to-supplier-situation.service.js";
import { OrderToSupplierStateService } from "../../../resource/orders-to-suppliers/services/order-to-supplier-state.service.js";
import { UserService } from "../../../iam/services/user.service.js";
import { ProfileService } from "../../../profiles/services/profile.service.js";
import { SupplyService } from "../../../resource/inventory/services/supply.service.js";
import { UnitMeasurementService } from "../../../resource/inventory/services/unit-measurement.service.js";

// Assemblers
import { OrderToSupplierAssembler } from "../../../resource/orders-to-suppliers/services/order-to-supplier.assembler.js";
import { OrderToSupplierStateAssembler } from "../../../resource/orders-to-suppliers/services/order-to-supplier-state.assembler.js";
import { OrderToSupplierSituationAssembler } from "../../../resource/orders-to-suppliers/services/order-to-supplier-situation.assembler.js";
import { OrderToSupplierSupplyAssembler } from "../../../resource/orders-to-suppliers/services/order-to-supplier-supply.assembler.js";
import { SupplyAssembler } from "../../../resource/inventory/services/supply.assembler.js";
import { UserAssembler } from "../../../iam/services/user.assembler.js";
import { ProfileAssembler } from "../../../profiles/services/profile.assembler.js";
import { UnitMeasurementAssembler } from "../../../resource/inventory/services/unit-measurement.assembler.js";

const RESTAURANT_ADMIN_ROLE_ID = 2;

export default {
  name: "suppliers-orders-overview",
  components: {
    DeleteConfirmation,
    DeliveredOrders, ApprovedOrders, EditOrder, OrderDetails, ManageNewOrders, EmptySection, NewOrders
  },
  data() {
    return {
      // Modal states
      modals: {
        manageNewOrder: false,
        newOrderDetails: false,
        edit: false,
        acceptedOrderDetails: false
      },

      // Selected data
      selectedOrder: null,
      selectedOrderState: null,
      selectedOrderSituation: null,
      selectedOrderSupplies: [],
      selectedOrderDetailedSupplies: [],

      // Main data
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

      // UI state
      activeTab: 0,
      loading: false,

      // Configuration
      tabs: [
        { title: 'New Orders', value: 0 },
        { title: 'Orders In Progress', value: 1 },
        { title: 'Orders Record', value: 2 }
      ]
    };
  },
  async created() {
    await this.initializeComponent();
  },
  computed: {
    deliveredOrders() {
      return this.orders.filter(order => {
        const state = this.findOrderState(order.stateId);
        return state && Number(state.id) === 4; // Delivered state
      });
    },

    // Computed properties for modal states to avoid v-model warnings
    showManageNewOrderModal: {
      get() { return this.modals.manageNewOrder; },
      set(value) { this.modals.manageNewOrder = value; }
    },

    showEditModal: {
      get() { return this.modals.edit; },
      set(value) { this.modals.edit = value; }
    },

    showNewOrderDetailsModal: {
      get() { return this.modals.newOrderDetails; },
      set(value) { this.modals.newOrderDetails = value; }
    },

    showAcceptedOrderDetailsModal: {
      get() { return this.modals.acceptedOrderDetails; },
      set(value) { this.modals.acceptedOrderDetails = value; }
    }
  },
  methods: {

    //Initialization methods
    async initializeComponent() {
      this.loading = true;

      try {
        this.initServices();
        await this.loadAllData();
        this.processData();
      } catch (error) {
        this.handleError("Failed to initialize component", error);
      } finally {
        this.loading = false;
      }
    },
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

    async loadAllData() {
      await Promise.all([
        this.loadOrderSituations(),
        this.loadOrderStates(),
        this.loadOrders(),
        this.loadSupplies(),
        this.loadRequestedSupplies(),
        this.loadUsersAndProfiles(),
        this.loadUnitsMeasurement(),
      ]);
    },

    processData() {
      this.groupSuppliesByOrder();
      this.groupSuppliesByOrderWithDetails();
    },

    // Data loading methods
    async loadOrderSituations() {
      const response = await this.orderSituationsService.getAll();
      this.orderSituations = OrderToSupplierSituationAssembler.toEntitiesFromResponse(response);
    },

    async loadOrderStates() {
      const response = await this.orderStatesService.getAll();
      this.orderStates = OrderToSupplierStateAssembler.toEntitiesFromResponse(response);
    },

    async loadOrders() {
      const response = await this.ordersService.getAll();
      this.orders = OrderToSupplierAssembler.toEntitiesFromResponse(response);
    },

    async loadSupplies() {
      const response = await this.suppliesService.getAll();
      this.supplies = SupplyAssembler.toEntitiesFromResponse(response);
    },

    async loadRequestedSupplies() {
      const response = await this.requestedSuppliesInOrdersService.getAll();
      this.requestedSuppliesInOrders = OrderToSupplierSupplyAssembler.toEntitiesFromResponse(response);
    },

    async loadUsersAndProfiles() {
      const [usersResponse, profilesResponse] = await Promise.all([
        this.usersService.getByRoleId(RESTAURANT_ADMIN_ROLE_ID),
        this.profilesService.getAll()
      ]);

      this.users = UserAssembler.toEntitiesFromResponse(usersResponse);
      const allProfiles = ProfileAssembler.toEntitiesFromResponse(profilesResponse);

      this.adminRestaurantsProfiles = allProfiles.filter(profile =>
          this.users.some(user => Number(user.id) === Number(profile.userId))
      );
    },

    async loadUnitsMeasurement() {
      const response = await this.unitsMeasurementService.getAll();
      this.unitsMeasurement = UnitMeasurementAssembler.toEntitiesFromResponse(response);
    },

// Data processing methods
    groupSuppliesByOrder() {
      const grouped = this.requestedSuppliesInOrders.reduce((acc, orderSupply) => {
        const orderId = orderSupply.orderId;
        if (!acc[orderId]) {
          acc[orderId] = [];
        }
        acc[orderId].push(orderSupply);
        return acc;
      }, {});

      this.suppliesGroupedByOrder = Object.entries(grouped).map(([orderId, supplies]) => ({
        orderId,
        supplies
      }));
    },

    groupSuppliesByOrderWithDetails() {
      const grouped = this.requestedSuppliesInOrders.reduce((acc, orderSupply) => {
        const { orderId, supplyId } = orderSupply;

        if (!acc[orderId]) {
          acc[orderId] = new Set();
        }
        acc[orderId].add(supplyId);
        return acc;
      }, {});

      this.detailedSuppliesGroupedByOrder = Object.entries(grouped).map(([orderId, supplyIdsSet]) => {
        const supplies = [...supplyIdsSet]
            .map(supplyId => this.supplies.find(supply => Number(supply.id) === Number(supplyId)))
            .filter(Boolean);

        return { orderId, supplies };
      });
    },

    // Modal methods
    openEditModal(order) {
      this.selectedOrder = order;
      this.selectedOrderState = this.findOrderState(order.stateId);
      this.selectedOrderSituation = this.findOrderSituation(order.situationId);
      this.modals.edit = true;
    },

    openNewOrderDetailsModal(order) {
      this.selectedOrder = order;
      this.selectedOrderSituation = this.findOrderSituation(order.situationId);

      const orderSupplies = this.getOrderSupplies(order.id);
      this.selectedOrderSupplies = orderSupplies.filter(supply => !supply.accepted);
      this.selectedOrderDetailedSupplies = this.getDetailedOrderSupplies(order.id);

      this.modals.newOrderDetails = true;
    },

    openOrderAcceptedDetailsModal(order) {
      this.selectedOrder = order;
      this.selectedOrderState = this.findOrderState(order.stateId);
      this.selectedOrderSituation = this.findOrderSituation(order.situationId);

      const orderSupplies = this.getOrderSupplies(order.id);
      this.selectedOrderSupplies = orderSupplies.filter(supply => supply.accepted);
      this.selectedOrderDetailedSupplies = this.getDetailedOrderSupplies(order.id);

      this.modals.acceptedOrderDetails = true;
    },

    openManageNewModal(order) {
      this.selectedOrder = { ...order };
      this.selectedOrderSupplies = [...this.getOrderSupplies(order.id)];
      this.selectedOrderDetailedSupplies = this.getDetailedOrderSupplies(order.id);
      this.modals.manageNewOrder = true;
    },

    closeAllModals() {
      Object.keys(this.modals).forEach(key => {
        this.modals[key] = false;
      });
      this.clearSelectedData();
    },

    clearSelectedData() {
      this.selectedOrder = null;
      this.selectedOrderState = null;
      this.selectedOrderSituation = null;
      this.selectedOrderSupplies = [];
      this.selectedOrderDetailedSupplies = [];
    },

  // Helper Methods
    findOrderState(stateId) {
      return this.orderStates.find(state => Number(state.id) === Number(stateId));
    },

    findOrderSituation(situationId) {
      return this.orderSituations.find(situation => Number(situation.id) === Number(situationId));
    },

    getOrderSupplies(orderId) {
      const orderGroup = this.suppliesGroupedByOrder.find(group =>
          Number(group.orderId) === Number(orderId)
      );
      return orderGroup ? orderGroup.supplies : [];
    },

    getDetailedOrderSupplies(orderId) {
      const orderGroup = this.detailedSuppliesGroupedByOrder.find(group =>
          Number(group.orderId) === Number(orderId)
      );
      return orderGroup ? orderGroup.supplies : [];
    },

    // Order handling methods
    async handleOrderUpdate(updateData) {
      if (this.processingOrder) return;

      this.processingOrder = true;

      try {
        await this.updateAcceptedOrder(updateData);
        await this.reloadOrderData();

        this.closeAllModals();
        this.showSuccessMessage('Order updated successfully');
      } catch (error) {
        this.handleError('Failed to update order', error);
      } finally {
        this.processingOrder = false;
      }
    },

    async handleDeclineOrder(order) {
      if (this.processingOrder) return;

      this.processingOrder = true;

      try {
        const declinedSituationId = 3; // Decline situation
        await this.updateOrderSituation(order, declinedSituationId);
        await this.reloadOrderData();

        this.showSuccessMessage('Order declined successfully');
      } catch (error) {
        this.handleError('Failed to decline order', error);
      } finally {
        this.processingOrder = false;
      }
    },

    async handleOrderSubmission(updateData) {
      if (this.processingOrder) return;

      this.processingOrder = true;

      try {
        await this.updateOrderDetails(updateData);
        await this.updateSuppliesAcceptance(updateData);
        await this.reloadOrderData();

        this.closeAllModals();
        this.showSuccessMessage('Order processed successfully');
      } catch (error) {
        this.handleError('Failed to process order', error);
      } finally {
        this.processingOrder = false;
      }
    },
    // Order update methods
    async updateOrderSituation(order, situationId) {
      const orderUpdatePayload = this.createOrderUpdatePayload(order, { situationId });
      await this.ordersService.update(order.id, orderUpdatePayload);
      this.updateLocalOrderData(order.id, orderUpdatePayload);
    },

    async updateAcceptedOrder(updateData) {
      const orderUpdatePayload = this.createOrderUpdatePayload(updateData.order, {
        estimatedShipDate: updateData.newEstimatedShipDate,
        estimatedShipTime: updateData.newEstimatedShipTime,
        description: updateData.newDescription,
        stateId: updateData.newState
      });

      await this.ordersService.update(updateData.order.id, orderUpdatePayload);
      this.updateLocalOrderData(updateData.order.id, orderUpdatePayload);
    },

    async updateOrderDetails(updateData) {
      const onHoldStateId = 1;
      const acceptedSituationId = 2;

      const orderUpdatePayload = this.createOrderUpdatePayload(updateData.order, {
        estimatedShipDate: updateData.newEstimatedShipDate,
        estimatedShipTime: updateData.newEstimatedShipTime,
        description: updateData.newDescription,
        stateId: onHoldStateId,
        situationId: acceptedSituationId,
        requestedProductsCount: updateData.newRequestedProductsCount,
        totalPrice: updateData.newTotalPrice,
        partiallyAccepted: updateData.partiallyAccepted
      });

      await this.ordersService.update(updateData.order.id, orderUpdatePayload);
      this.updateLocalOrderData(updateData.order.id, orderUpdatePayload);
    },

    async updateSuppliesAcceptance(updateData) {
      const orderSuppliesGroup = this.suppliesGroupedByOrder.find(group =>
          Number(group.orderId) === Number(updateData.order.id)
      );

      if (!orderSuppliesGroup || !orderSuppliesGroup.supplies.length) {
        throw new Error(`No supplies found for order ${updateData.order.id}`);
      }

      const updatePromises = orderSuppliesGroup.supplies.map(async (supplyOrder) => {
        const isAccepted = updateData.selectedSupplies.includes(Number(supplyOrder.supplyId));

        const updatePayload = {
          id: supplyOrder.id,
          order_to_supplier_id: supplyOrder.orderId,
          supply_id: supplyOrder.supplyId,
          quantity: supplyOrder.quantity,
          accepted: isAccepted
        };

        const response = await this.requestedSuppliesInOrdersService.update(supplyOrder.id, updatePayload);
        this.updateLocalSupplyData(supplyOrder.id, { accepted: isAccepted });

        return response;
      });

      await Promise.all(updatePromises);
    },

    // Utility methods
    createOrderUpdatePayload(order, updates = {}) {
      return {
        id: order.id,
        date: order.date,
        estimated_ship_date: updates.estimatedShipDate || order.estimatedShipDate,
        estimated_ship_time: updates.estimatedShipTime || order.estimatedShipTime,
        description: updates.description || order.description,
        admin_restaurant_id: order.adminRestaurantId,
        supplier_id: order.supplierId,
        order_to_supplier_state_id: updates.stateId || order.stateId,
        order_to_supplier_situation_id: updates.situationId || order.situationId,
        requested_products_count: updates.requestedProductsCount || order.requestedProductsCount,
        total_price: updates.totalPrice || order.totalPrice,
        partially_accepted: updates.partiallyAccepted !== undefined ? updates.partiallyAccepted : order.partiallyAccepted,
      };
    },

    updateLocalOrderData(orderId, updates) {
      const orderIndex = this.orders.findIndex(order => Number(order.id) === Number(orderId));
      if (orderIndex !== -1) {
        this.orders[orderIndex] = { ...this.orders[orderIndex], ...updates };
      }
    },

    updateLocalSupplyData(supplyId, updates) {
      const supplyIndex = this.requestedSuppliesInOrders.findIndex(supply =>
          Number(supply.id) === Number(supplyId)
      );
      if (supplyIndex !== -1) {
        this.requestedSuppliesInOrders[supplyIndex] = {
          ...this.requestedSuppliesInOrders[supplyIndex],
          ...updates
        };
      }
    },

    async reloadOrderData() {
      await Promise.all([
        this.loadOrders(),
        this.loadRequestedSupplies()
      ]);
      this.processData();
    },

    //Error handling and notifications
    handleError(message, error) {
      console.error(message, error);
      this.showErrorMessage(message);
    },

    showSuccessMessage(message) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
      });
    },

    showErrorMessage(message) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000
      });
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
            :order-situations="orderSituations"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="orders"
            :supplies="supplies"
            @open-modal="openManageNewModal"
            @open-details-modal="openNewOrderDetailsModal"
            @decline-order="handleDeclineOrder"
        ></new-orders>
      </pv-tab-panel>
      <pv-tab-panel :value="1">
        <approved-orders
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders="orders"
            :order-states="orderStates"
            :order-situations="orderSituations"
            @open-edit-modal="openEditModal"
            @open-details-modal="openOrderAcceptedDetailsModal"
            @delete-order="handleDeclineOrder">
        </approved-orders>
      </pv-tab-panel>
      <pv-tab-panel :value="2">
        <delivered-orders
            :detailed-supplies-per-order="detailedSuppliesGroupedByOrder"
            :admin-restaurants-profiles="adminRestaurantsProfiles"
            :orders-supplies="suppliesGroupedByOrder"
            :orders="deliveredOrders"
            @open-details-modal="openOrderAcceptedDetailsModal">
        </delivered-orders>
      </pv-tab-panel>
    </pv-tab-panels>
  </pv-tabs>

  <!-- Modals -->
  <manage-new-orders
      v-model="showManageNewOrderModal"
      :order="selectedOrder"
      :detailed-supplies-per-order="selectedOrderDetailedSupplies"
      :supplies-per-order="selectedOrderSupplies"
      :units-measurement="unitsMeasurement"
      @submit-order="handleOrderSubmission($event)"
  />

  <edit-order
      v-model="showEditModal"
      :order="selectedOrder"
      :situation="selectedOrderSituation"
      :state="selectedOrderState"
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