<script setup> import {computed, ref} from 'vue'
import BaseModal from '../../../../shared/components/base-modal.component.vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({modelValue: Boolean, selectedBatches: Array})
const emit = defineEmits(['update:modelValue', 'close', 'back', 'submitted'])
const batchQuantities = ref({})
const groupedBySupply = computed(() => {
  const map = new Map()
  props.selectedBatches.forEach(batchInfo => {
    const key = batchInfo.supply.id
    if (!map.has(key)) {
      map.set(key, {supply: batchInfo.supply, batches: []})
    }
    map.get(key).batches.push(batchInfo)
  })
  return Array.from(map.values())
})
const totalItems = computed(() => {
  return Object.values(batchQuantities.value).reduce((a, b) => a + (b || 0), 0)
})
const totalPrice = computed(() => {
  return props.selectedBatches.reduce((sum, b) => {
    const qty = batchQuantities.value[b.batch.id] || 0
    const unitPrice = b.supply.price || 0
    return sum + qty * unitPrice
  }, 0)
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function goBack() {
  emit('back')
}

function submitOrder() {
  emit('submitted', {quantities: batchQuantities.value})
  close()
} </script>
<template>
  <base-modal :model-value="modelValue" title="Review Order Details" @close="close">
    <template #default>
      <div v-for="group in groupedBySupply" :key="group.supply.id" class="summary-block"><p><strong>Supply:</strong>
        {{ group.supply.name }}</p>
        <p>{{ group.supply.description }}</p>
        <div v-for="batchInfo in group.batches" :key="batchInfo.batch.id" class="batch-entry">
          <p>
            <strong>Supplier:</strong> {{ batchInfo.supplier.name }} |
            <strong>Batch:</strong> #{{ batchInfo.batch.id }} |
            <strong>Stock:</strong> {{ batchInfo.batch.stock }} |
            <strong>Exp:</strong> {{ batchInfo.batch.expiration_date }}
          </p>

          <pv-input-number
              v-model="batchQuantities[batchInfo.batch.id]"
              :max="batchInfo.batch.stock"
              :min="0"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              inputClass="quantity-input"
          />
        </div>

        <hr/>
      </div>

      <div class="total-footer">
        <p><strong>Total Units:</strong> {{ totalItems }}</p>
        <p><strong>Total Price:</strong> S/ {{ totalPrice.toFixed(2) }}</p>
      </div>
    </template>

    <template #footer>
      <pv-button label="Cancel" class="btn-cancel" @click="close"/>
      <pv-button label="Back" class="btn-back" @click="goBack"/>
      <pv-button label="Submit Order" class="btn-submit" @click="submitOrder"/>
    </template>
  </base-modal>
</template>
<style scoped>
.summary-block {
  margin-bottom: 2rem;
}

.batch-entry {
  margin: 0.5rem 0;
}

.quantity-input {
  width: 150px;
}

.total-footer {
  text-align: right;
  margin-top: 1.5rem;
}

.btn-cancel {
  background-color: #D9534F;
  color: white;
}

.btn-back {
  background-color: #ccc;
  color: black;
}

.btn-submit {
  background-color: #4F8A5B;
  color: white;
}
</style>