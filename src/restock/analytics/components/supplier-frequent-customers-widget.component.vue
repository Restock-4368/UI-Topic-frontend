<script setup>
import { ref, onMounted } from 'vue'
import { OrderToSupplierService } from '../../resource/orders-to-suppliers/services/order-to-supplier.service.js'
import { ProfileService} from "../../profiles/services/profile.service.js";
import { UserService} from "../../iam/services/user.service.js";

const customers = ref([])
const isMobile = ref(false)
const supplierId = 1 // Reemplazar cuando haya auth real

function checkViewport() {
  isMobile.value = window.innerWidth <= 800
}

function getPairs(list) {
  const pairs = []
  for (let i = 0; i < list.length; i += 2) {
    pairs.push(list.slice(i, i + 2))
  }
  return pairs
}

onMounted(async () => {
  checkViewport()
  window.addEventListener('resize', checkViewport)

  const orderService = new OrderToSupplierService()
  const userService = new UserService()
  const profileService = new ProfileService()

  const allOrdersRes = await orderService.getAll()
  const allOrders = allOrdersRes?.data || []

  const filteredOrders = allOrders.filter(o => o.supplier_id === supplierId)

  const frequencyMap = new Map()
  for (const order of filteredOrders) {
    const userId = order.admin_restaurant_id
    frequencyMap.set(userId, (frequencyMap.get(userId) ?? 0) + 1)
  }

  const sortedEntries = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

  const usersRes = await userService.getByRoleId(2)
  const users = usersRes.data || []

  customers.value = await Promise.all(
      sortedEntries.map(async ([userId, count]) => {
        const user = users.find(u => u.id === userId)
        const profileRes = await profileService.getByQuery('user_id', userId)
        const profile = profileRes?.data?.[0]

        return {
          name: profile?.business?.name || user?.email || 'Unknown',
          category: profile?.business?.categories || 'No category',
          description: `Has placed ${count} order${count > 1 ? 's' : ''} in total.`,
          count
        }
      })
  )
})
</script>

<template>
  <div>
    <div v-if="isMobile" class="mobile-header"><h3>Frequent Customers</h3></div>
    <div class="frequent-customers-container">
      <div v-if="!isMobile" class="header"><h3>Frequent Customers</h3></div>

      <!-- Desktop -->
      <div class="cards-grid" v-if="!isMobile">
        <div class="customer-card" v-for="(customer, index) in customers" :key="index">
          <div class="card-header">
            <h4>{{ customer.name }}</h4>
<!--            <span class="count-badge">{{ customer.count }}</span>-->
          </div>
          <p class="category"><i class="pi pi-tag mr-2" /> {{ customer.category }}</p>
          <p class="description">{{ customer.description }}</p>
        </div>
      </div>

      <!-- Mobile -->
      <div class="frequent-grid" v-else>
        <div class="restaurant-card" v-for="(c, i) in customers" :key="i">
          <h4>{{ c.name }}</h4>
          <p class="category"><i class="pi pi-tag mr-1" /> {{ c.category }}</p>
          <p class="description text-xs text-gray-600">{{ c.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frequent-customers-container {
  background: #fff;
  padding: 10px 30px 30px 30px;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.customer-card {
  background-color: #eaf8f2;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.count-badge {
  background: #007bff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.customer-card h4 {
  margin-bottom: 0.25rem;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.customer-card .category {
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  margin-bottom: 0.5rem;
}

.customer-card .description {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
}

.mobile-header h3 {
  font-family: Poppins, sans-serif;
  font-weight: bold;
  font-size: 23px;
  margin-bottom: 10px;
}

@media (max-width: 800px) {
  .frequent-customers-container {
    padding: 1rem;
  }
  .frequent-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 0;
    background: #fff;
    border-radius: 30px;
  }

  .restaurant-card {
    background-color: #f0f4f7;
    border-radius: 15px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: 160px;
    flex: 0 0 auto;
  }

  .restaurant-card h4 {
    font-size: 14px;
    margin: 0 0 4px;
  }

  .restaurant-card p {
    font-size: 12px;
    color: #757575;
    margin-bottom: 0.25rem;
  }
}
</style>
