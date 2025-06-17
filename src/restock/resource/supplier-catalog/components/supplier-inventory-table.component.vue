<script setup>
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import {SupplyBatchService} from '../../inventory/services/supply-batch.service.js'
import {SupplyService} from '../../inventory/services/supply.service.js'
import {UnitMeasurementService} from '../../inventory/services/unit-measurement.service.js'
import {SupplyCategoryService} from '../../inventory/services/supply-category.service.js'
import {Supply} from '../../inventory/model/supply.entity.js'
import {SupplyBatch} from '../../inventory/model/supply-batch.entity.js'

const props = defineProps({supplierId: {type: Number, required: true}})

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const allBatches = ref([])
const selectedItem = ref(null)
const showDetailModal = ref(false)
const isMobile = ref(false)

const rowsPerPageOptions = [
  {label: '5', value: 5},
  {label: '10', value: 10},
  {label: '20', value: 20},
  {label: '50', value: 50}
]

const categoryService = new SupplyCategoryService()
const unitService = new UnitMeasurementService()
const supplyService = new SupplyService()
const batchService = new SupplyBatchService()

function checkViewport() {
  isMobile.value = window.innerWidth <= 800
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport)
})

const filteredInventory = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return allBatches.value
  return allBatches.value.filter(
      item =>
          item.name?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term)
  )
})

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInventory.value.slice(start, end)
})

const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredInventory.value.length))
const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage.value))

const getColumns = computed(() =>
    isMobile.value
        ? ['name', 'category', 'stock', 'actions']
        : ['name', 'category', 'stock', 'unit', 'expiration_date', 'perishable']
)

function openDetail(item) {
  selectedItem.value = item
  showDetailModal.value = true
}

function getExpirationRowClass(data) {
  return data.expiration_date && new Date(data.expiration_date) < new Date()
      ? 'expired-row'
      : ''
}

async function loadBatchesWithSupply(supplierId) {
  try {
    const response = await batchService.getAll()
    const rawBatches = response.data.filter(b => b.supplier_id === supplierId)
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
        enrichedBatches.push({...supply, ...batch})
      } catch (err) {
        enrichedBatches.push(batch)
      }
    }
    allBatches.value = enrichedBatches
  } catch (err) {
    console.error('Error loading batches:', err)
  }
}

watch(() => props.supplierId, (newVal) => {
  if (newVal) loadBatchesWithSupply(newVal)
}, {immediate: true})
</script>
<template>
  <div class="supplier-table-wrapper">
    <div class="supplier-table-header">
      <div class="supplier-table-search">
        <i class="pi pi-search supplier-search-icon"/>
        <pv-input-text
            v-model="search"
            placeholder="Buscar insumo..."
            class="supplier-table-search-bar"
        />
      </div>

      <div class="supplier-table-controls">
        <span>{{ paginationStart }}-{{ paginationEnd }} de {{ filteredInventory.length }}</span>
        <div class="supplier-page-size">
          <label for="rowsPerPage">Filas:</label>
          <pv-select
              id="rowsPerPage"
              v-model="itemsPerPage"
              :options="rowsPerPageOptions"
              option-label="label"
              option-value="value"
          />
        </div>
        <pv-button icon="pi pi-angle-left" text :disabled="currentPage === 1" @click="currentPage--"/>
        <pv-button icon="pi pi-angle-right" text :disabled="currentPage >= totalPages" @click="currentPage++"/>
      </div>
    </div>

    <div class="supplier-table-scroll-wrapper">
      <pv-data-table
          :value="paginatedInventory"
          responsiveLayout="scroll"
          :rowClass="getExpirationRowClass"
          class="supplier-table"
      >
        <pv-column v-if="getColumns.includes('name')" field="name" header="Insumo"/>
        <pv-column v-if="getColumns.includes('category')" field="category" header="Categoría"/>
        <pv-column v-if="getColumns.includes('stock')" field="stock" header="Stock"/>
        <pv-column v-if="getColumns.includes('unit')" header="Unidad">
          <template #body="{ data }">{{ data.unit }}</template>
        </pv-column>
        <pv-column v-if="getColumns.includes('expiration_date')" header="Caducidad">
          <template #body="{ data }">{{ data.expiration_date }}</template>
        </pv-column>
        <pv-column v-if="getColumns.includes('perishable')" header="Perecible">
          <template #body="{ data }">{{ data.perishable ? 'Sí' : 'No' }}</template>
        </pv-column>
        <pv-column v-if="getColumns.includes('actions')" header="">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" text @click="openDetail(data)"/>
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <pv-dialog
        v-model:visible="showDetailModal"
        header="Detalle del insumo"
        modal
        style="width: 400px"
    >
      <div v-if="selectedItem">
        <p><strong>Insumo:</strong> {{ selectedItem.name }}</p>
        <p><strong>Categoría:</strong> {{ selectedItem.category }}</p>
        <p><strong>Unidad:</strong> {{ selectedItem.unit }}</p>
        <p><strong>Caducidad:</strong> {{ selectedItem.expiration_date }}</p>
        <p><strong>Stock:</strong> {{ selectedItem.stock }}</p>
        <p><strong>Perecible:</strong> {{ selectedItem.perishable ? 'Sí' : 'No' }}</p>
      </div>
    </pv-dialog>
  </div>
</template>
<style>
.supplier-table-wrapper {
margin-top: 2rem;
}

.supplier-table-header {
display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
margin-bottom: 1rem;
}

.supplier-table-search {
position: relative;
display: flex;
align-items: center;
}

.supplier-search-icon {
position: absolute;
left: 10px;
top: 50%;
transform: translateY(-50%);
color: #6c757d;
font-size: 1rem;
z-index: 1;
}

.supplier-table-search-bar {
padding-left: 2rem !important;
width: 300px;
}

.supplier-table-controls {
display: flex;
align-items: center;
gap: 10px;
font-size: 14px;
}

.supplier-page-size {
display: flex;
align-items: center;
gap: 0.5rem;
}

.supplier-table-scroll-wrapper {
max-height: 300px;
overflow-y: auto;
}

.supplier-table ::v-deep(.expired-row) {
background-color: rgba(244, 21, 21, 0.3) !important;
}
</style>