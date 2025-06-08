
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
    suppliesPerOrder: {
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
      checkedSupplies: [],
      selectAll: false,
      step: 1,
      localOrder: {
        description: '',
        estimatedShipDate: null,
        estimatedShipTime: null
      }
    };
  },
  methods: {
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
    productName(supplyId) {
      const supply = this.detailedSuppliesPerOrder.find(s => Number(s.id) === Number(supplyId));
      return supply ? supply.name : 'Unknown Product';
    },
    productUnitMeasurement(supplyId) {
      const supply = this.detailedSuppliesPerOrder.find(s => Number(s.id) === Number(supplyId));
      const unitMeasurement = this.unitsMeasurement.find(u => Number(u.id) === Number(supply.unit_measurement_id));
      return unitMeasurement ? unitMeasurement.name : 'Unknown unit';
    },
    onSupplySelectionChange() {
      this.selectAll = this.isAllSelected;
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.checkedSupplies = this.suppliesPerOrder.map(item => item.supplyId);
      } else {
        this.checkedSupplies = [];
      }
    },
    close() {
      this.$emit('update:modelValue', false); // esto cierra el modal desde el padre
      this.$emit('close');
    },
    // onUpdateRequest() {
    //   this.$emit('update:modelValue', this.order);
    //   this.resetForm();
    // },
    resetForm() {
      this.checkedSupplies = [];
      this.selectAll = false;
      this.step = 1;
      this.localOrder = {
        description: '',
        estimatedShipDate: null,
        estimatedShipTime: null
      };
    },
    initializeLocalOrder() {
      if (this.order) {
        this.localOrder = {
          ...this.order,
          estimatedShipDate: this.order.estimatedShipDate || null,
          estimatedShipTime: this.order.estimatedShipTime || null
        };
      }
    },
    async submitOrder() {
      if (this.checkedSupplies.length === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select at least one supply',
          life: 3000
        });
        return;
      }

      const newProductsCount = this.checkedSupplies.reduce((sum, supplyId) => {
        const supplyInOrder = this.suppliesPerOrder.find(s =>
            Number(s.supplyId) === Number(supplyId)
        );
        return sum + (supplyInOrder ? supplyInOrder.quantity : 0);
      }, 0);

      const updateData = {
        order: this.order,
        partiallyAccepted: this.checkedSupplies.length < this.suppliesPerOrder.length,
        newEstimatedShipDate: this.localOrder.estimatedShipDate,
        newEstimatedShipTime: this.localOrder.estimatedShipTime,
        newTotalPrice: this.calculateNewTotalPrice(),
        newDescription: this.localOrder.description,
        newRequestedProductsCount: newProductsCount,
        selectedSupplies: this.checkedSupplies,
      };

      this.$emit('submit-order', updateData);
      this.resetForm();
      this.close();
    },

    calculateNewTotalPrice() {
      return this.checkedSupplies.reduce((total, supplyId) => {
        const supplyInOrder = this.suppliesPerOrder.find(s =>
            Number(s.supplyId) === Number(supplyId)
        );
        const supplyDetails = this.detailedSuppliesPerOrder.find(s =>
            Number(s.id) === Number(supplyId)
        );

        if (supplyInOrder && supplyDetails) {
          return total + (supplyDetails.price * supplyInOrder.quantity);
        }
        return total;
      }, 0);
    },

    isValidSelection() {
      return this.checkedSupplies.length > 0 &&
          this.order.estimatedShipDate &&
          this.order.estimatedShipTime;
    },

    selectionSummary() {
      return {
        totalSelected: this.checkedSupplies.length,
        totalAvailable: this.suppliesPerOrder.length,
        isPartial: this.checkedSupplies.length < this.suppliesPerOrder.length,
        newPrice: this.calculateNewTotalPrice()
      };
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.step = 1;
        this.initializeLocalOrder();
      } else {
        // Resetear cuando se cierra el modal
        this.resetForm();
      }
    },
    // Watcher mejorado para checkedSupplies
    checkedSupplies: {
      handler(newVal) {
        // Actualizar selectAll sin disparar el watcher recursivamente
        this.$nextTick(() => {
          this.selectAll = this.isAllSelected;
        });
      },
      deep: true
    },
    order: {
      handler(newOrder) {
        this.initializeLocalOrder();
      },
      immediate: true,
      deep: true
    },
    // Agregar watcher para suppliesPerOrder por si cambian dinámicamente
    suppliesPerOrder: {
      handler() {
        // Si las supplies cambian, resetear la selección para evitar inconsistencias
        this.checkedSupplies = this.checkedSupplies.filter(id =>
            this.suppliesPerOrder.some(supply => supply.supplyId === id)
        );
      },
      deep: true
    }
  },
  emits: ['close', 'submit-order', 'update:modelValue'],
  computed: {
    isAllSelected() {
      return this.checkedSupplies.length === this.suppliesPerOrder.length && this.suppliesPerOrder.length > 0;
    }
  },
}
</script>

<template>
  <base-modal :model-value="modelValue"
              :title="'New Order Management'"
              @close="close"
  >

    <div class="modal-content">

      <p class="subtitle">Complete the order details to start tracking your order. </p>

      <div v-if="step === 1">
        <div class="section-header">
          <h4 class="section-title">Supplies</h4>
          <p class="section-description">Select the supplies you have available for the order.</p>
        </div>

        <div class="select-all-container">
          <p class="select-all-label">Select All</p>
          <pv-check-box
              v-model="selectAll"
              :binary="true"
              @change="toggleSelectAll"
          />
        </div>
        <div class="table-container">
          <pv-data-table
              class="supplies-table"
              :value="suppliesPerOrder"
              paginator
              :rows="4"
              :rows-per-page-options="[2, 3, 4]"
              responsive-layout="scroll"
          >
            <pv-column field="date" header="Product name">
              <template #body="{ data }">
                {{ productName(data.supplyId) }}
              </template>
            </pv-column>

            <pv-column header="Quantity">
              <template #body="{ data }">
                {{ data.quantity }}
              </template>
            </pv-column>

            <pv-column header="Unit Measure">
              <template #body="{ data }">
                {{ productUnitMeasurement(data.supplyId) }}
              </template>
            </pv-column>

            <pv-column>
              <template #body="{ data }">
                <pv-check-box
                    :value="data.supplyId"
                    v-model="checkedSupplies"
                    :binary="false"
                />
              </template>
            </pv-column>
          </pv-data-table>

        </div>

        <div class="total-price">
          <strong class="block text-sm font-medium text-gray-700 mb-1">Total Price: {{ order.totalPrice }}</strong>
        </div>

        <!-- Description -->
        <div class="section-description">
          <p for="description" class="block text-sm font-medium text-gray-700 mb-2">Order Description</p>
          <pv-input-text id="description" v-model="localOrder.description" placeholder="Description"
                         class="description-input"/>
        </div>
      </div>

      <!-- Step 2: Summary view -->
      <div v-else-if="step === 2">

        <div class="date-section">
          <p for="expiry" class="date-label">Estimated Shipping Date</p>
          <pv-date-picker
              id="expiry"
              v-model="localOrder.estimatedShipDate"
              showIcon
              class="date-picker"
              placeholder="Seleccionar fecha"
          />
        </div>

        <div class="time-section">
          <p for="shipTime" class="date-label">
            Estimated Shipping Time
          </p>
          <pv-date-picker
              id="shipTime"
              v-model="localOrder.estimatedShipTime"
              timeOnly
              hourFormat="24"
              showIcon
              placeholder="Seleccionar hora"
              class="date-picker"
          />

          <h3 class="summary-title">Order Summary</h3>
          <ul class="summary-list">
            <li class="summary-item" v-for="id in checkedSupplies" :key="id">
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
            Back
          </button>

          <button class="btn btn-close" @click="close">Close</button>

        </div>

        <div class="footer-right">
          <button
              v-if="step === 1"
              class="btn btn-next"
              @click="nextStep"
          >
            Next
          </button>

          <button
              v-if="step === 2"
              class="btn btn-accept"
              @click="submitOrder"
          >
            Accept selection
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