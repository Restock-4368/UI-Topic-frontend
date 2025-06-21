<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "order-details",
  components: {BaseModal},
  props: {
    hideState: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    requestedBatchesPerOrder: {
      type: Array,
      required: true,
    },
    detailedSuppliesPerOrder: {
      type: Array,
      required: true,
    },
    detailedBatchesPerOrder: {
      type: Array,
      required: true,
    },
    order: {
      type: [Object, null],
      required: true,
    },
    orderState: {
      type: [Object, null],
      required: false,
    },
    orderSituation: {
      type: [Object, null],
      required: true,
    },
    unitsMeasurement: {
      type: Array,
      required: true,
    },
    adminRestaurantsProfiles: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      step: 1,
      steps: ["On hold", "Preparing", "On the way", "Delivered"],
      statusToStepIndex: {
        1: 0,  // -> "On hold"
        2: 1,  //  -> "Preparing"
        3: 2,  // -> "On the way"
        4: 3,  //  -> "Delivered"
      }
    };
  },
  computed: {
    computedCurrentIndex() {
      return this.orderState?.id !== undefined
          ? this.statusToStepIndex[this.orderState.id] ?? 0
          : 1;
    }
  },

  methods: {
    nextStep() {
      if (this.step < 2) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
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
    formatDate(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    },
    formatTime(dateStr) {
      if (!dateStr) return 'Not set';
      const date = new Date(dateStr);
      return date.toLocaleString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    restaurantBusinessName(order) {
        const profile = this.adminRestaurantsProfiles.find(p => p.user_id === order.adminRestaurantId);
        return profile ? profile.business.name : 'Unknown Restaurant';
    },
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close', false);
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.step = 1;
      }
    }
  },

  emits: ['update:modelValue', 'close'],
}
</script>

<template>
  <base-modal :model-value="modelValue"
              :title="'Order Details'"
              @close="close"
  >

  <div class="modal-content">

    <p class="subtitle">View the details of a registered order.</p>


    <div v-if="step === 1">
      <div class="section-header">
        <h4 class="section-title">Supplies</h4>
        <p class="section-description">View the supplies you have available for the order.</p>
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
        <pv-column field="date" header="Product name">
          <template #body="{ data }">
            {{ productName(data.batchId) }}
          </template>
        </pv-column>

        <pv-column header="Quantity">
          <template #body="{ data }">
            {{ data.quantity }}
          </template>
        </pv-column>

        <pv-column header="Unit Measure">
          <template #body="{ data }">
            {{ productUnitMeasurement(data.batchId) }}
          </template>
        </pv-column>
      </pv-data-table>

    </div>

      <div class="total-price">
        <strong class="block text-sm font-medium text-gray-700 mb-1" >Total Price: {{ order.totalPrice }}</strong>
      </div>

    <div class="state-dragger"  v-if="!hideState">

      <p class="section-title">State</p>

      <!-- Contenedor del stepper -->
      <div class="stepper-container">

        <!-- Línea de progreso principal -->
        <div class="progress-line">
          <div
              class="progress-fill"
              :style="{ width: `${(computedCurrentIndex / (steps.length - 1)) * 100}%` }"
          ></div>
        </div>

        <!-- For of stepper -->
        <div class="steps-wrapper">
          <div
              v-for="(stepName, index) in steps"
              :key="index"
              class="step-item"
              @dragover.prevent
          >
            <!-- Truck -->
            <div
                v-if="computedCurrentIndex === index"
                class="truck-container"
                draggable="true"
            >
              <i class="pi pi-truck truck-icon"></i>
            </div>

            <!-- Punto del paso -->
            <div
                class="step-point"
                :class="{
                'completed': computedCurrentIndex > index,
                'active': computedCurrentIndex === index,
                'pending': computedCurrentIndex < index
              }"
            >
              <i v-if="computedCurrentIndex > index" class="pi pi-check check-icon"></i>
            </div>

            <!-- Etiqueta del paso -->
            <span
                class="step-label"
                :class="{ 'active': computedCurrentIndex === index }"
            >
                      {{ stepName }}
                  </span>
          </div>
        </div>
      </div>
    </div>


    </div>

    <!-- Step 2: Summary view -->
    <div v-if="step === 2">

      <div class="situation" v-if="hideState">
        <p class="block text-sm font-bold text-gray-700 mb-1">
          Situation
          <pv-chip class=" text-sm ml-1 mt-1 mb-1">{{ orderSituation?.name || 'Unknown' }}</pv-chip>
        </p>
      </div>

      
      <div class="restaurant-section">
        <p class="block text-sm font-bold text-gray-700 mb-2">Restaurant Name: </p>
        <p class="mb-3">{{ restaurantBusinessName(order) }}</p>
      </div>

      <div class="date-section" v-if="!hideState">
        <p class="block text-sm font-bold text-gray-700 mb-2">Estimated Ship Date and Time: </p>
        <p class="mb-3"> {{ formatDate(order.estimatedShipDate) }},  {{ formatTime(order.estimatedShipTime) }}</p>
      </div>


      <div class="description-section">
        <p class="block text-sm font-bold text-gray-700 mb-2">Order Description</p>
        <p class="mb-3">{{ order.description }}</p>
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
      </div>
    </div>

  </template>
  </base-modal>
</template>

<style scoped>
.stepper-container {
  position: relative;
  padding: 1rem 0;
}

/* Línea de progreso principal */
.progress-line {
  position: absolute;
  top: 3rem;
  left: 5%;
  right: 5%;
  height: 2px;
  margin-top: 5px;
  background-color: #e5e7eb;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

/* Contenedor de pasos */
.steps-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

/* Camión */
.truck-container {
  animation: bounce 2s infinite;
}


.truck-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Puntos de los pasos */
.step-point {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
}

.step-point.completed {
  background-color: #3b82f6;
  color: white;
}

.step-point.active {
  background-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.step-point.pending {
  background-color: #9ca3af;
}

.check-icon {
  font-size: 0.625rem;
  font-weight: bold;
}

/* Etiquetas de los pasos */
.step-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
  transition: color 0.3s ease;
  max-width: 80px;
  line-height: 1.2;
}

.step-label.active {
  color: #3b82f6;
  font-weight: 600;
}

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

.table-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  margin-top: 20px;
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

.btn-next,
.btn-back{
  background-color: #F28C38;
  color: white;
}

.btn-next:hover,
.btn-back:hover {
  background-color: #e68900;
}

/* Responsive */
@media (max-width: 640px) {
  .stepper-container {
    padding: 1rem 0;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .truck-icon {
    font-size: 1.25rem;
  }

}
</style>