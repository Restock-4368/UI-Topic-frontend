<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'

import {OrderToSupplierService} from '../../resource/orders-to-suppliers/services/order-to-supplier.service.js'
import {
  OrderToSupplierSituationService
} from '../../resource/orders-to-suppliers/services/order-to-supplier-situation.service.js'
import {UserService} from '../../iam/services/user.service.js'
import {ProfileService} from '../../profiles/services/profile.service.js'

// Simula usuario logueado (ajusta si tienes auth real)
const currentSupplierId = 1

const alerts = ref([])
const isMobile = ref(false)

const router = useRouter()

const displayedColumns = ['restaurant', 'status', 'orderPlaced']
const mobileColumns = ['restaurant', 'status']

const columnsToShow = computed(() => isMobile.value ? mobileColumns : displayedColumns)

function checkViewport() {
  isMobile.value = window.innerWidth <= 800
}

onMounted(async () => {
  checkViewport()
  window.addEventListener('resize', checkViewport)

  const orderService = new OrderToSupplierService()
  const situationService = new OrderToSupplierSituationService()
  const userService = new UserService()
  const profileService = new ProfileService()

  const [ordersRes, situationsRes] = await Promise.all([
    orderService.getByQuery('supplier_id', currentSupplierId),
    situationService.getAll()
  ])

  const orders = Array.isArray(ordersRes.data) ? ordersRes.data : []
  const situations = Array.isArray(situationsRes.data) ? situationsRes.data : []

  const situationMap = new Map(situations.map(s => [s.id, s]))

  const enriched = await Promise.all(orders.map(async (order) => {
    const situation = situationMap.get(order.order_to_supplier_situation_id)
    const userRes = await userService.getByQuery('id', order.admin_restaurant_id)
    const user = userRes?.data?.[0]

    if (!user) return null

    const profileRes = await profileService.getByQuery('user_id', user.id)
    const profile = profileRes?.data?.[0]

    const restaurantName = profile?.business?.name ?? 'Unknown'

    const orderDate = new Date(order.date ?? '')
    const now = new Date()
    const diffMs = now - orderDate
    const diffMins = Math.floor(diffMs / 60000)

    let elapsedTime = ''
    if (diffMins < 60) elapsedTime = `${diffMins} min ago`
    else elapsedTime = `${Math.floor(diffMins / 60)} hr ago`

    return {
      restaurant: restaurantName,
      status: situation?.name ?? 'Unknown',
      orderPlaced: elapsedTime,
      createdAt: new Date(order.date)
    }
  }))

  alerts.value = enriched
      .filter(Boolean)
      .sort((a, b) => b.createdAt - a.createdAt) // Últimas primero
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport)
})

function goToOrders() {
  router.push('/dashboard/supplier/orders')
}
</script>

<template>
  <div>
    <div v-if="isMobile" class="mobile-header">
      <h3 class="text-lg font-semibold">Last Notifications
        <button @click="goToOrders" class="view-all-btn text-sm">
          <i class="pi pi-arrow-right ml-2"/>
        </button>
      </h3>
    </div>

    <div class="widget-container">
      <div v-if="!isMobile">
        <h3 class="text-lg font-semibold">Last Notifications
          <button @click="goToOrders" class="view-all-btn text-sm">
            <i class="pi pi-arrow-right ml-2"/>
          </button>
        </h3>
      </div>

      <div
          class="scroll-wrapper"
          :style="{ overflowY: alerts.length > 3 ? 'auto' : 'visible' }"
      >
        <pv-data-table :value="alerts" responsiveLayout="scroll">
          <pv-column
              v-if="columnsToShow.includes('restaurant')"
              field="restaurant"
              header="Restaurant"
              class="text-sm"
          />
          <pv-column
              v-if="columnsToShow.includes('status')"
              field="status"
              header="Status"
          >
            <template #body="{ data }">
              <pv-button
                  :label="data.status"
                  :class="[
                  'text-white w-10rem text-sm font-normal border-round-sm h-2rem',
                  data.status.toLowerCase().includes('declined') ? 'bg-red-500' :
                  data.status.toLowerCase().includes('approved') ? 'bg-green-600' :
                  'bg-orange-500'
                ]"
              />
            </template>
          </pv-column>
          <pv-column
              v-if="columnsToShow.includes('orderPlaced')"
              field="orderPlaced"
              header="Order placed"
              class="text-sm"
          />
        </pv-data-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-container {
  background: #fff;
  padding: 10px 30px 20px 30px;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}

.scroll-wrapper {
  max-height: 250px;
  overflow-y: auto;
}

.view-all-btn {
  color: #007bff;
  background: white;
  padding: 6px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.view-all-btn:hover {
  background: #005fcc;
  color: white;
}

@media (max-width: 800px) {
  .mobile-header h3 {
    font-family: Poppins, sans-serif;
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .widget-container {
    padding: 1em;
  }
}
</style>
