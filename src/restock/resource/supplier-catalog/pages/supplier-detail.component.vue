<script setup> import {useRoute, useRouter} from 'vue-router'
import {ref, computed, onMounted} from 'vue'
import SupplierSummary from '../components/supplier-summary.component.vue'
import {SupplierAssembler} from '../services/supplier.assembler.js'

const API_URL = import.meta.env.VITE_API_BASE_URL
const USERS_PATH = import.meta.env.VITE_USERS_ENDPOINT_PATH
const ROLES_PATH = import.meta.env.VITE_ROLES_ENDPOINT_PATH
const PROFILES_PATH = import.meta.env.VITE_PROFILES_ENDPOINT_PATH
const PROFILES_CATEGORIES_PATH = import.meta.env.VITE_PROFILES_BUSINESS_CATEGORIES_ENDPOINT_PATH
const CATEGORIES_PATH = import.meta.env.VITE_BUSINESS_CATEGORIES_ENDPOINT_PATH
const router = useRouter()
const route = useRoute()
const supplier = ref(null)
const notFound = computed(() => supplier.value === null)
const goBack = () => {
  router.push('/dashboard/restaurant/suppliers')
}
onMounted(async () => {
  const id = parseInt(route.params.id)
  try {
    const [userRes, rolesRes, profilesRes, pbcRes, categoriesRes] = await Promise.all([fetch(`${API_URL}${USERS_PATH}/${id}`), fetch(`${API_URL}${ROLES_PATH}`), fetch(`${API_URL}${PROFILES_PATH}`), fetch(`${API_URL}${PROFILES_CATEGORIES_PATH}`), fetch(`${API_URL}${CATEGORIES_PATH}`)])
    if (!userRes.ok) throw new Error('User not found')
    const user = await userRes.json()
    const roles = await rolesRes.json()
    const profiles = await profilesRes.json()
    const profileCategoryLinks = await pbcRes.json()
    const categories = await categoriesRes.json()
    const supplierRole = roles.find(r => r.name === 'supplier')
    if (!supplierRole || user.role_id !== supplierRole.id) throw new Error('Not a supplier')
    const profile = profiles.find(p => p.user_id === user.id)
    const categoryIds = profileCategoryLinks.filter(link => link.profile_id === profile?.id).map(link => link.business_category_id)
    const supplierCategories = categories.filter(c => categoryIds.includes(c.id))
    supplier.value = SupplierAssembler.toSupplierEntity({
      user,
      profile,
      role: supplierRole,
      categories: supplierCategories
    })
  } catch (err) {
    console.error('Error loading supplier:', err)
    supplier.value = null
  }
})
</script>
<template>
  <div class="content">
    <div v-if="notFound" class="not-found"><h2>Supplier not found</h2>
      <pv-button class="supplier-back-btn" icon="pi pi-arrow-left" label="Back" @click="goBack"/>
    </div>
    <div v-else class="supplier-detail-wrapper">
      <pv-button class="supplier-back-btn-overlay" icon="pi pi-arrow-left" text rounded @click="goBack"/>
      <supplier-summary :supplier="supplier"/>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  padding: 0 3rem;
}

.not-found {
  text-align: center;
  margin-top: 3rem;
}

.supplier-back-btn {
  background-color: #4F8A5B !important;
  color: white !important;
  border-radius: 2px;
  padding: 15px;
}

.supplier-detail-wrapper {
  position: relative;
}

.supplier-back-btn-overlay {
  position: absolute;
  top: 2rem;
  left: -1rem;
  background-color: #4F8A5B !important;
  color: white !important;
  border-radius: 50px;
  padding: 0.5rem;
  z-index: 10;
}

/* Ocultar en mobile */
@media (max-width: 1260px) {
  .supplier-back-btn-overlay {
    display: none;
  }
}
</style>