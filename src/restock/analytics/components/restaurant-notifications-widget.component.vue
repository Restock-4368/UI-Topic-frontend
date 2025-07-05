<script setup>
import {ref, onMounted} from 'vue'
import {useRestaurantNotifications} from "../../resource/inventory/services/restaurant-notifications.service.js";

// Registrar componentes de PrimeVue (alias opcionales)
const selectedTab = ref('inventory')
const inventoryAlerts = ref([])
const orderAlerts = ref([])

onMounted(async () => {
  const {getInventoryAlerts, getOrderAlerts} = useRestaurantNotifications()
  inventoryAlerts.value = await getInventoryAlerts()
  orderAlerts.value = await getOrderAlerts()

  selectedTab.value = 'inventory'
})
</script>

<template>
  <div>
    <h3 class="widget-title">Last Notifications</h3>
    <div class="widget-container">
      <pv-tabs v-model="selectedTab" class="custom-tabs">
        <pv-tab-list class="custom-tablist">
          <pv-tab value="inventory">
            Inventory
            <span v-if="inventoryAlerts.length" class="tab-badge">{{ inventoryAlerts.length }}</span>
          </pv-tab>
          <pv-tab value="orders">
            Orders
            <span v-if="orderAlerts.length" class="tab-badge">{{ orderAlerts.length }}</span>
          </pv-tab>
        </pv-tab-list>


        <pv-tab-panels class="scroll-wrapper">
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
            <pv-data-table
                v-if="orderAlerts.length"
                :value="orderAlerts"
                responsiveLayout="scroll"
            >
              <pv-column field="ingredient" header="Order">
                <template #body="{ data }">
                  <span>{{ data.ingredient }}</span>
                </template>
              </pv-column>
              <pv-column field="status" header="Status">
                <template #body="{ data }">
        <span
            :class="['status-badge', data.status.includes('Delivered') ? 'low-stock' : 'max-stock']"
        >
          {{ data.status }}
        </span>
                </template>
              </pv-column>
            </pv-data-table>

            <p v-else>No order notifications</p>
          </pv-tab-panel>


        </pv-tab-panels>
      </pv-tabs>
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

.custom-tablist .p-tab.p-highlight {
  background-color: #f5f5f5;
  color: #000;
  border: 1px solid #ccc;
  border-bottom: none;
}

.scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 260px;
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
</style>