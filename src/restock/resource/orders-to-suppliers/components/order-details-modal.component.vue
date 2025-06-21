<script>
import BaseModal from '../../../../shared/components/base-modal.component.vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

export default {
  name: 'OrderDetailsModalComponent',
  components: {
    BaseModal,
    'pv-button': Button,
    'pv-input-number': InputNumber
  },
  props: {
    modelValue: Boolean,
    selectedBatches: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'close', 'back', 'submitted'],
  data() {
    return {
      batchQuantities: {}
    }
  },
  watch: {
    selectedBatches: {
      immediate: true,
      handler(newVal) {
        console.log('🧪 [DetailModal] selectedBatches:', newVal);
        console.log('🧪 [groupedBySupply]:', this.groupedBySupply);

        newVal?.forEach(({batch}) => {
          if (batch && batch.id != null && this.batchQuantities[batch.id] == null) {
            this.batchQuantities = {
              ...this.batchQuantities,
              [batch.id]: 1
            };
          }
        });
      }
    }
  },
  computed: {
    groupedBySupply() {
      const map = new Map();
      this.selectedBatches?.forEach(({supply, batch, supplier}) => {
        if (!supply || !batch) return;
        const supplyId = supply.id;
        if (!map.has(supplyId)) {
          map.set(supplyId, {
            supply,
            batches: []
          });
        }
        map.get(supplyId).batches.push({batch, supply, supplier});
      });
      return Array.from(map.values());
    },
    totalItems() {
      return Object.values(this.batchQuantities).reduce((acc, val) => acc + (val || 0), 0);
    },
    totalPrice() {
      return this.selectedBatches.reduce((acc, {batch, supply}) => {
        const qty = this.batchQuantities[batch.id] || 0;
        return acc + qty * (supply.price || 0);
      }, 0);
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    goBack() {
      this.$emit('back');
    },
    submitOrder() {
      this.$emit('submitted', {
        batches: this.selectedBatches,
        quantities: this.batchQuantities
      });
      this.close();
    }
  }
};
</script>


<template>
  <base-modal :model-value="modelValue" title="Revisar detalle de orden" @close="close">
    <template #default>
      <div v-for="group in groupedBySupply" :key="group.supply.id">
        <p><strong>Insumo:</strong> {{ group.supply.name }}</p>
        <p>{{ group.supply.description }}</p>

        <div v-for="entry in group.batches" :key="entry.batch.id">
          <p>
            Proveedor: {{ entry.supplier.name }} |
            Batch: #{{ entry.batch.id }} |
            Stock: {{ entry.batch.stock }} |
            Expira: {{ entry.batch.expiration_date }}
          </p>
          <pv-input-number
              v-model="batchQuantities[entry.batch.id]"
              :max="entry.batch.stock"
              :min="0"
              showButtons
          />
        </div>
      </div>
      <div class="total-footer">
        <p><strong>Total de unidades:</strong> {{ totalItems }}</p>
        <p><strong>Total a pagar:</strong> S/ {{ totalPrice.toFixed(2) }}</p>
      </div>
    </template>

    <template #footer>
      <pv-button label="Cancelar" class="btn-cancel" @click="close"/>
      <pv-button label="Agregar otro producto" class="btn-back" @click="goBack"/>
      <pv-button label="Confirmar orden" class="btn-submit" @click="submitOrder"/>
    </template>
  </base-modal>
</template>
<style scoped> .summary-block {
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
  background-color: #d9534f;
  color: white;
}

.btn-back {
  background-color: #f28c38;
  color: white;
}

.btn-submit {
  background-color: #4f8a5b;
  color: white;
}
</style>