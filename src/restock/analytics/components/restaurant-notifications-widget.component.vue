<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRestaurantNotifications } from "../../resource/inventory/services/restaurant-notifications.service.js"

const selectedTab = ref('inventory')
const inventoryAlerts = ref([])
const orderAlerts = ref([])

// Computed para tabs visibles
const visibleTabs = computed(() => {
  const tabs = []
  if (inventoryAlerts.value?.length) tabs.push('inventory')
  if (orderAlerts.value?.length) tabs.push('orders')
  return tabs
})

onMounted(async () => {
  const { getInventoryAlerts, getOrderAlerts } = useRestaurantNotifications()

  inventoryAlerts.value = await getInventoryAlerts() || []
  orderAlerts.value = await getOrderAlerts() || []

  // Selecciona la primera tab visible
  if (visibleTabs.value.length > 0) {
    selectedTab.value = visibleTabs.value[0]
  }
})
</script>

<template>
  <div>
    <h3 class="widget-title">Last Notifications</h3>
    <div class="widget-container">
      <template v-if="visibleTabs.length">
        <pv-tabs :value="selectedTab" @update:value="selectedTab = $event" class="custom-tabs">
          <pv-tab-list class="custom-tablist">
            <pv-tab v-if="inventoryAlerts?.length" value="inventory">Inventory</pv-tab>
            <pv-tab v-if="orderAlerts?.length" value="orders">Orders</pv-tab>
          </pv-tab-list>

          <pv-tab-panels class="scroll-wrappern">
            <pv-tab-panel value="inventory">
              <pv-data-table :value="inventoryAlerts" responsiveLayout="scroll">
                <pv-column field="ingredient" header="Supplies">
                  <template #body="{ data }">
                    <span>{{ data.ingredient }}</span>
                  </template>
                </pv-column>
                <pv-column field="status" header="Status">
                  <template #body="{ data }">
                    <span :class="['status-badge', data.status === 'Low stock' ? 'low-stock' : 'max-stock']">
                      {{ data.status }}
                    </span>
                  </template>
                </pv-column>
              </pv-data-table>
            </pv-tab-panel>

            <pv-tab-panel value="orders">
              <pv-data-table :value="orderAlerts" responsiveLayout="scroll">
                <pv-column field="ingredient" header="Order">
                  <template #body="{ data }">
                    <span>{{ data.ingredient }}</span>
                  </template>
                </pv-column>
                <pv-column field="status" header="Status">
                  <template #body="{ data }">
                    <span :class="['status-badge', data.status.includes('Delivered') ? 'low-stock' : 'max-stock']">
                      {{ data.status }}
                    </span>
                  </template>
                </pv-column>
              </pv-data-table>
            </pv-tab-panel>
          </pv-tab-panels>
        </pv-tabs>
      </template>

      <p v-else class="no-notifications">No notifications to display</p>
    </div>
  </div>
</template>

<style>
.widget-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 10px;
}

.widget-container {
  background: #fff;
  padding: 20px 24px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  min-height: 310px;
  max-height: 310px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.custom-tablist {
  display: flex;
  gap: 10px;
  margin-bottom: 0;
}

:deep(.p-tabs-nav) {
  border-bottom: none !important;
  margin-bottom: 10px;
}

.custom-tablist .p-tab {
  padding: 8px 16px;
  border-radius: 6px 6px 0 0;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.custom-tablist .p-tab.p-tab-active {
  border: 2px solid #007bff !important;
  border-bottom: none !important;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  background-color: white !important;
  color: #000 !important;
}

.scroll-wrappern {
  flex: 1;
  overflow-y: auto;
  max-height: 230px;
  margin: 0;
}

.p-datatable thead th {
  font-size: 13px;
  font-weight: 600;
  color: #757575 !important;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0;
  justify-content: center;
}

.p-datatable tbody td {
  font-size: 13px;
  color: #333;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0 !important;
}

.status-badge {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.tab-badge {
  background-color: #ff5252;
  color: white;
  font-size: 11px;
  font-weight: bold;
  border-radius: 10px;
  padding: 2px 6px;
  margin-left: 8px;
}

.low-stock {
  background-color: #FFEAEA;
  color: #FF5252;
}

.max-stock {
  background-color: #FFF1E0;
  color: #FB8C00;
}

.no-notifications {
  font-size: 14px;
  color: #888;
  text-align: center;
  margin-top: 40px;
}
.custom-tabs {
  --p-tabs-active-bar-height: 0 !important;
}

</style>
