<script setup> import {useRoute, useRouter} from 'vue-router'
import {ref, computed, onMounted} from 'vue'
import SupplierSummary from '../components/supplier-summary.component.vue'

const router = useRouter()
const route = useRoute()
const mockSuppliers = [{
  id: 1,
  name: 'Frutas Perú SAC',
  email: 'ventas@frutasperu.com',
  address: 'Av. Perú 123, Lima',
  category: 'Frutas'
}, {
  id: 2,
  name: 'Carnes Selectas',
  email: 'contacto@carnesseleccionadas.com',
  address: 'Calle 9, Surco',
  category: 'Carnes'
}, {
  id: 3,
  name: 'Abarrotes Lima',
  email: 'soporte@abarroteslima.pe',
  address: 'Av. Benavides 452',
  category: 'Abarrotes'
}]
const supplier = ref(null)
const notFound = computed(() => supplier.value === null)
onMounted(() => {
  const id = parseInt(route.params.id)
  supplier.value = mockSuppliers.find(s => s.id === id) || null
})
const goBack = () => {
  router.push('/dashboard/restaurant/suppliers/')
}
function handleAddSupplier(id) {
  const match = mockSuppliers.find(s => s.id === id)
  if (match) match.added = true
}
</script>
<template>
  <div class="content">
    <div v-if="notFound" class="not-found"><h2>Supplier not found</h2>
      <pv-button class="supplier-back-btn" icon="pi pi-arrow-left" label="Back" @click="goBack"/>
    </div>
    <div v-else class="supplier-detail">
      <pv-button
          class="supplier-back-btn-fix"
          icon="pi pi-arrow-left"
          text
          rounded
          @click="goBack"
      />
      <supplier-summary :supplier="supplier"/>
    </div>
  </div>
</template>
<style scoped>
.content {
  width: 100%;
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

.supplier-back-btn-fix {
  background-color: #4F8A5B !important;
  color: white !important;
  border-radius: 50px;
  padding: 0.5rem;
} </style>