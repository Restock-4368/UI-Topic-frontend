<script setup>
import {ref} from 'vue'

const alerts = ref([
  {ingredient: 'Tomates', status: 'Low stock'},
  {ingredient: 'Lechuga', status: 'Max stock'},
  {ingredient: 'Cebolla', status: 'Low stock'},
  {ingredient: 'Papas', status: 'Low stock'}])
</script>

<template>
  <div><h3 class="widget-title">Last alerts</h3>
    <div class="widget-container">
      <div class="scroll-wrapper">
        <pv-data-table :value="alerts" responsiveLayout="scroll" class="alerts-table">
          <pv-column field="ingredient" header="Supplies">
            <template #body="slotProps"><span>{{ slotProps.data.ingredient }}</span></template>
          </pv-column>
          <pv-column field="status" header="Status">
            <template #body="slotProps"><span
                :class="[ 'status-badge', slotProps.data.status === 'Low stock' ? 'low-stock' : 'max-stock' ]">{{
                slotProps.data.status
              }}</span></template>
          </pv-column>
        </pv-data-table>
      </div>
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
  min-height: 300px;
  max-height: 300px;
  overflow: hidden;
}

.scroll-wrapper {
  max-height: 260px;
  overflow-y: auto;
}

.p-datatable thead th {
  font-size: 16px;
  font-weight: 600;
  color: #757575;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0;
  background-color: white;
}

.p-datatable tbody td {
  font-size: 14px;
  color: #333;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0;
}

.status-badge {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
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