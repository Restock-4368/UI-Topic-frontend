
<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "manage-new-orders",
  components: {BaseModal},
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    requestedBatchesPerOrder: {
      type: Array,
      required: true,
    },
    detailedBatchesPerOrder: {
      type: Array,
      required: true,
    },
    detailedSuppliesPerOrder: {
      type: Array,
      required: true,
    },
    order: {
      type: [Object, null],
      required: true,
    },
    unitsMeasurement: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      selectAll: false,
      checkedBatches: [],
      localOrder: this.defaultOrder(),
    };
  },
  computed: {
    allSelected() {
      return this.checkedBatches.length === this.requestedBatchesPerOrder.length && this.requestedBatchesPerOrder.length > 0;
    },
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.step = 1;
        this.localOrder = this.defaultOrder();
      } else {
        this.resetForm();
      }
    },
    checkedBatches: {
      handler() {
        this.$nextTick(() => {
          this.selectAll = this.allSelected;
        });
      },
      deep: true
    },
    order: {
      handler() {
        this.localOrder = this.defaultOrder();
      },
      immediate: true,
      deep: true
    },
    requestedBatchesPerOrder: {
      handler() {
        this.checkedBatches = this.checkedBatches.filter(id =>
            this.requestedBatchesPerOrder.some(s => s.batchId === id)
        );
      },
      deep: true
    }
  },
  methods: {
    defaultOrder() {
      return {
        description: '',
        estimatedShipDate: null,
        estimatedShipTime: null
      };
    },
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    resetForm() {
      this.checkedBatches = [];
      this.selectAll = false;
      this.step = 1;
      this.localOrder = this.defaultOrder();
    },
    productName(batchId) {
      const batch = this.detailedBatchesPerOrder.find(b => Number(b.id) === Number(batchId));
      const supply = this.detailedSuppliesPerOrder.find(s => Number(s.id) === Number(batch.supply_id));
      return supply ? supply.name : 'Unknown Product';
    },
    productUnitMeasurement(batchId) {
      const batch = this.detailedBatchesPerOrder.find(b => Number(b.id) === Number(batchId));
      const supply = this.detailedSuppliesPerOrder.find(s => Number(s.id) === Number(batch.supply_id));
      const unitMeasurement = this.unitsMeasurement.find(u => Number(u.id) === Number(supply.unit_measurement_id));
      return unitMeasurement ? unitMeasurement.name : 'Unknown unit';
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.checkedBatches = this.requestedBatchesPerOrder.map(item => item.batchId);
      } else {
        this.checkedBatches = [];
      }
    },
    calculateNewTotalPrice() {
      return this.checkedBatches.reduce((total, batchId) => {
        const requestedBatchInOrder = this.requestedBatchesPerOrder.find(s =>
            Number(s.batchId) === Number(batchId)
        );
        const batchDetails = this.detailedBatchesPerOrder.find(b =>
            Number(b.id) === Number(batchId));

        const supplyDetails = this.detailedSuppliesPerOrder.find(s =>
        Number(s.id) === Number(batchDetails.supply_id));

        if (requestedBatchInOrder && supplyDetails) {
          return total + (supplyDetails.price * requestedBatchInOrder.quantity);
        }
        return total;
      }, 0);
    },

    async submitOrder() {
      console.log('Submitting order with data:',  this.checkedBatches.length  );
      if (this.checkedBatches.length === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select at least one supply',
          life: 3000
        });
        return;
      }

      const newProductsCount = this.checkedBatches.length;

      const updateData = {
        order: this.order,
        partiallyAccepted: this.checkedBatches.length < this.requestedBatchesPerOrder.length,
        newEstimatedShipDate: this.localOrder.estimatedShipDate,
        newEstimatedShipTime: this.localOrder.estimatedShipTime,
        newTotalPrice: this.calculateNewTotalPrice(),
        newDescription: this.localOrder.description,
        newRequestedProductsCount: newProductsCount,
        selectedBatches: this.checkedBatches,
      };

      this.$emit('submit-order', updateData);
      this.resetForm();
      this.close();
    }
  },
  emits: ['close', 'submit-order', 'update:modelValue']
}
</script>

<template>
  <base-modal :model-value="modelValue"
              :title="$t('supplier-orders.manage-new-orders.title')"
              @close="close"
  >

    <div class="modal-content">

      <p class="subtitle">{{ $t('supplier-orders.manage-new-orders.description') }}</p>

      <div v-if="step === 1">
        <div class="section-header">
          <h4 class="section-title">{{ $t('supplier-orders.supplies.title') }}</h4>
          <p class="section-description">{{ $t('supplier-orders.supplies.description') }}</p>
        </div>

        <div class="select-all-container">
          <p class="select-all-label">{{ $t('supplier-orders.supplies.select-all') }}</p>
          <pv-check-box
              v-model="selectAll"
              :binary="true"
              @change="toggleSelectAll"
          />
        </div>
        <div class="table-container">
          <pv-data-table
              class="supplies-table"
              :value="requestedBatchesPerOrder"
              paginator
              :rows="4"
              :rows-per-page-options="[2, 3, 4]"
              responsive-layout="scroll"
          >
            <pv-column field="date" :header="$t('supplier-orders.supplies.headers.product-name')">
              <template #body="{ data }">
                {{ productName(data.batchId) }}
              </template>
            </pv-column>

            <pv-column :header="$t('supplier-orders.supplies.headers.quantity')">
              <template #body="{ data }">
                {{ data.quantity }}
              </template>
            </pv-column>

            <pv-column :header="$t('supplier-orders.supplies.headers.unit-measure')">
              <template #body="{ data }">
                {{ productUnitMeasurement(data.batchId) }}
              </template>
            </pv-column>

            <pv-column>
              <template #body="{ data }">
                <pv-check-box
                    :value="data.batchId"
                    v-model="checkedBatches"
                    :binary="false"
                />
              </template>
            </pv-column>
          </pv-data-table>

        </div>

        <div class="total-price">
          <strong class="block text-sm font-medium text-gray-700 mb-1">{{ $t('supplier-orders.supplies.total-price') }}: {{ order.totalPrice }}</strong>
        </div>

        <!-- Description -->
        <div class="section-description">
          <p class="block text-sm font-medium text-gray-700 mb-2">{{ $t('supplier-orders.description') }}</p>
          <pv-input-text id="description" v-model="localOrder.description" placeholder="Description"
                         class="description-input"/>
        </div>
      </div>

      <!-- Step 2: Summary view -->
      <div v-else-if="step === 2">

        <div class="date-section">
          <p class="date-label">{{ $t('supplier-orders.estimated-ship-date') }}</p>
          <pv-date-picker
              id="expiry"
              v-model="localOrder.estimatedShipDate"
              showIcon
              class="date-picker"
              :placeholder="$t('supplier-orders.placeholder.select-date')"
          />
        </div>

        <div class="time-section">
          <p class="date-label">
            {{ $t('supplier-orders.estimated-ship-time') }}
          </p>
          <pv-date-picker
              id="shipTime"
              v-model="localOrder.estimatedShipTime"
              timeOnly
              hourFormat="24"
              showIcon
              :placeholder="$t('supplier-orders.placeholder.select-time')"
              class="date-picker"
          />

          <h3 class="summary-title">{{ $t('supplier-orders.manage-new-orders.order-summary') }}</h3>
          <ul class="summary-list">
            <li class="summary-item" v-for="id in checkedBatches" :key="id">
              {{ productName(id) }} ({{ productUnitMeasurement(id) }})
            </li>
          </ul>

        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <div class="footer-left">

          <button
              v-if="step === 2"
              class="btn btn-back"
              @click="prevStep"
          >
            {{ $t('supplier-orders.manage-new-orders.buttons.back') }}
          </button>

          <button class="btn btn-close" @click="close">{{ $t('supplier-orders.manage-new-orders.buttons.close') }}</button>

        </div>

        <div class="footer-right">
          <button
              v-if="step === 1"
              class="btn btn-next"
              @click="nextStep"
          >
            {{ $t('supplier-orders.manage-new-orders.buttons.next') }}
          </button>

          <button
              v-if="step === 2"
              class="btn btn-accept"
              @click="submitOrder"
          >
            {{ $t('supplier-orders.manage-new-orders.buttons.submit-order') }}
          </button>
        </div>


      </div>

    </template>
  </base-modal>

</template>

<style scoped>

.modal-content {
  padding: 1rem;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.4;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.select-all-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 12px 12px;
  gap: 8px;
  font-size: 14px;
}

.table-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  font-size: 14px;
}

.supplies-table {
  width: 100%;
  border-collapse: collapse;
}

.total-price {
  background-color: #f8f9fa;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.description-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 2rem 0 16px 0;
}

.summary-item {
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.summary-item:last-child {
  border-bottom: none;
}

.date-section, .time-section {
  margin-bottom: 16px;
}

.date-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.date-picker {
  width: 100%;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.footer-left {
  display: flex;
  gap: 12px;
  flex: 0 0 auto;
}

.footer-right {
  display: flex;
  gap: 12px;
  flex: 0 0 auto;
}

.btn {
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-close {
  background-color: #D9534F;
  color: white;
}

.btn-close:hover {
  background-color: #c82333;
}

.btn-accept {
  background-color: #4F8A5B;
  color: white;
}

.btn-accept:hover {
  background-color: #2c4e33;
}


.btn-next,
.btn-back {
  background-color: #F28C38;
  color: white;
}

.btn-next:hover,
.btn-back:hover {
  background-color: #e68900;
}
</style>