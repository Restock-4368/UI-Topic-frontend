<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {SupplyBatchService} from '../../inventory/services/supply-batch.service.js'
import {SupplyService} from '../../inventory/services/supply.service.js'
import {UnitMeasurementService} from '../../inventory/services/unit-measurement.service.js'
import {SupplyCategoryService} from '../../inventory/services/supply-category.service.js'
import {Supply} from '../../inventory/model/supply.entity.js'
import {SupplyBatch} from '../../inventory/model/supply-batch.entity.js'

const props = defineProps({
  supplierId: {
    type: Number,
    required: true
  }
})

console.log('[supplier-inventory-table] supplierId prop received:', props.supplierId)

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const allBatches = ref([])

const categoryService = new SupplyCategoryService()
const unitService = new UnitMeasurementService()
const supplyService = new SupplyService()
const batchService = new SupplyBatchService()

function getExpirationRowClass(data) {
  return data.expiration_date && new Date(data.expiration_date) < new Date()
      ? 'expired-row'
      : ''
}

const filteredInventory = computed(() => {
  if (!search.value.trim()) return allBatches.value
  const term = search.value.toLowerCase()
  return allBatches.value.filter(
      item =>
          item.name.toLowerCase().includes(term) ||
          (item.category && item.category.toLowerCase().includes(term))
  )
})

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInventory.value.slice(start, end)
})

const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, filteredInventory.value.length)
)
const totalPages = computed(() =>
    Math.ceil(filteredInventory.value.length / itemsPerPage.value)
)

async function loadBatchesWithSupply(supplierId) {
  try {
    console.log('[loadBatchesWithSupply] called with supplierId:', supplierId)
    const response = await batchService.getAll()
    const rawBatches = response.data.filter(b => b.supplier_id === supplierId)
    console.log('[loadBatchesWithSupply] filtered rawBatches:', rawBatches)
    const enrichedBatches = []

    for (const b of rawBatches) {
      const batch = new SupplyBatch(b)
      try {
        const supplyResponse = await supplyService.getById(batch.supply_id)
        const supply = new Supply(supplyResponse.data)

        const categoryResponse = await categoryService.getById(supply.category_id)
        supply.category = categoryResponse.data.name

        const unitResponse = await unitService.getById(supply.unit_measurement_id)
        supply.unit = unitResponse.data.name

        enrichedBatches.push({
          ...supply,
          ...batch,
          category: supply.category,
          unit: supply.unit
        })
      } catch (err) {
        console.error(`❌ Error enriching batch ${batch.id}`, err)
        enrichedBatches.push(batch)
      }
    }

    allBatches.value = enrichedBatches
    console.log('[loadBatchesWithSupply] allBatches final:', allBatches.value)
  } catch (err) {
    console.error('❌ Error loading batches:', err)
  }
}

// Watch supplierId and load batches when ready
watch(
    () => props.supplierId,
    newVal => {
      console.log('[watch] supplierId changed to:', newVal)
      if (newVal) {
        loadBatchesWithSupply(newVal)
      }
    },
    {immediate: true}
)
</script>


<template>
  <div class="inventory-section">
    <div class="inventory-header">
      <pv-input-text v-model="search" placeholder="Search supply..." class="search-bar"/>
      <div class="pagination-controls">
        <span>{{ paginationStart }}-{{ paginationEnd }} of {{ filteredInventory.length }}</span>
        <pv-button icon="pi pi-angle-left" text :disabled="currentPage === 1" @click="currentPage--"/>
        <pv-button icon="pi pi-angle-right" text :disabled="currentPage >= totalPages" @click="currentPage++"/>
      </div>
    </div>

    <div style="max-height: 300px; overflow-y: auto;">
      <pv-data-table :value="paginatedInventory" responsiveLayout="scroll"
                     :rowClass="(data) => getExpirationRowClass(data)" class="overflow-x-auto">
        <pv-column field="name" header="Insumos"/>
        <pv-column field="category" header="Categoría"/>
        <pv-column field="unit" header="Unidad de medida"/>
        <pv-column field="expiration_date" header="Fecha de caducidad"/>
        <pv-column field="stock" header="Stock"/>
        <pv-column field="perishable" header="Perecible"/>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>
.inventory-section {
  margin-top: 2rem;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-bar {
  width: 300px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.expired-row {
  background-color: rgba(244, 21, 21, 0.3) !important;
}
</style>
