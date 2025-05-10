<template>
  <div class="inventory-wrapper">

    <div class="inventory-header flex justify-content-between align-items-center mb-4">
      <h2 class="text-xl font-bold">{{ $t('inventory.title') }}</h2>
      <pv-button icon="pi pi-plus" class="p-button-sm p-button-success" :label="$t('inventory.create')" />
    </div>

    <!-- Estado vacío -->
    <div v-if="ingredients.length === 0" class="empty-state-card surface-card p-4 border-round shadow-2">
      <p class="mb-3">{{ $t('inventory.emptyMessage') }}</p>
      <pv-button class="p-button-success" :label="$t('inventory.createItems')" />
    </div>

    <!-- Sección de búsqueda y lista -->
    <div v-else>
      <div class="inventory-tools flex justify-content-between align-items-center mb-3">
        <h3>{{ $t('inventory.listTitle') }}</h3>
        <div class="p-inputgroup w-30">
          <pv-input-text v-model="search" :placeholder="$t('inventory.search')" />
          <pv-button icon="pi pi-plus" class="p-button-sm" :label="$t('inventory.add')" />
        </div>
      </div>

      <!-- Simulación de tabla vacía -->
      <div class="empty-table flex flex-column align-items-center justify-content-center border-1 surface-border border-round py-6 mt-4">
        <i class="pi pi-box text-4xl mb-3 text-gray-400" />
        <p class="text-gray-500 text-center px-4">
          {{ $t('inventory.noItems') }}
        </p>
      </div>

      <!-- Simulación de paginación -->
      <div class="pagination-tools mt-4 flex justify-content-end align-items-center gap-2 text-sm">
        <span>{{ $t('inventory.rowsPerPage') }}</span>
        <pv-dropdown :options="[5, 10, 15]" v-model="rows" />
        <span>1–5 of 10</span>
        <pv-button icon="pi pi-angle-left" class="p-button-text p-button-sm" />
        <pv-button icon="pi pi-angle-right" class="p-button-text p-button-sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ingredients = ref([]) // Lista vacía para mostrar el estado vacío
const search = ref('')
const rows = ref(5)
</script>

<style scoped>
.inventory-wrapper {
  padding: 1.5rem;
}

.empty-state-card {
  text-align: center;
  background-color: #f9fafb;
  border: 1px dashed #cbd5e1;
}

.empty-table {
  background-color: #f4f4f5;
  min-height: 200px;
}
</style>
