<script>
import {defineComponent} from 'vue'
import RestaurantPendingOrdersWidget from "../components/restaurant-pending-orders-widget.component.vue";
import RestaurantLastSuppliesWidget from "../components/restaurant-last-supplies-widget.component.vue";
import RestaurantNotificationsWidgetComponent from "../components/restaurant-notifications-widget.component.vue";

export default defineComponent({
  name: "restaurant-summary-overview",
  components: {RestaurantNotificationsWidgetComponent, RestaurantLastSuppliesWidget, RestaurantPendingOrdersWidget}
})
</script>

<template>
  <div class="restaurant-summary-overview">
    <div class="summary-row summary-row-1">
      <restaurant-pending-orders-widget class="widget widget-pending"/>
      <restaurant-notifications-widget-component class="widget widget-alerts"/>
    </div>
    <div class="summary-row summary-row-2">
      <restaurant-last-supplies-widget class="widget widget-supplies"/>
    </div>
  </div>
</template>

<style>
.restaurant-summary-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  max-width: 1260px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

.summary-row {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.summary-row-1 {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.summary-row-2 {
  display: flex;
  width: 100%;
}

.widget-pending {
  flex: 2;
  min-width: 0;
}

.widget-alerts {
  flex: 1;
  min-width: 0;
}

.widget-supplies {
  width: 100%;
}

@media (max-width: 1190px) {
  .summary-row-1, .summary-row-2 {
    flex-direction: column;
  }

  .widget-pending, .widget-alerts, .widget-supplies {
    width: 100% !important;
  }
} </style>