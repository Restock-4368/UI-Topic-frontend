<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "order-details",
  components: {BaseModal},
  props: {
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
      step: 1,
      steps: ["On hold", "Preparing", "On the way", "Delivered"],
      currentIndex: 1, // ejemplo: "Preparing"
      draggingIndex: null
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
    close() {
      this.$emit('close');
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.step = 1; // Cuando se abre, reinicia el paso
      }
    }
  },
  computed: {
    internalVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
}
</script>

<template>
  <base-modal :model-value="internalVisible"
  :title="'Order Details'"
  @close="$emit('close')"
  >

  <div class="p-4">
    <p class="block text-sm font-medium text-gray-700 mb-1">View the details of a registered order.</p>

    <div v-if="step === 1">
      <h4>Supplies</h4>
      <p class="block text-sm font-medium text-gray-700 mb-1">View the supplies you have available for the order.</p>

      <pv-data-table
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
      </pv-data-table>

      <p class="block text-sm font-medium text-gray-700 mb-1" >Total Price: {{ order.totalPrice }}</p>


        <label class="block text-sm font-bold text-gray-700 mb-1">State</label>

        <!-- Contenedor del stepper -->
        <div class="stepper-container">

          <!-- Línea de progreso principal -->
          <div class="progress-line">
            <div
                class="progress-fill"
                :style="{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }"
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
                  v-if="currentIndex === index"
                  class="truck-container"
                  draggable="true"
              >
                <i class="pi pi-truck truck-icon"></i>
              </div>

              <!-- Punto del paso -->
              <div
                  class="step-point"
                  :class="{
                'completed': currentIndex > index,
                'active': currentIndex === index,
                'pending': currentIndex < index
              }"
              >
                <i v-if="currentIndex > index" class="pi pi-check check-icon"></i>
              </div>

              <!-- Etiqueta del paso -->
              <span
                  class="step-label"
                  :class="{ 'active': currentIndex === index }"
              >
              {{ stepName }}
            </span>
            </div>
          </div>
      </div>


    </div>

    <!-- Paso 2: Vista de resumen -->
          <div v-if="step === 2">

            <div class="situation">
              <label class="block text-sm font-bold text-gray-700 mb-1">
                Situation
                <pv-chip class=" text-sm ml-1 mt-1 mb-1">Approved</pv-chip>
              </label>
            </div>

            <p class="block text-sm font-medium text-gray-700 mb-1">Order Description: </p>
            <p>{{ order.description }}</p>


            <p class="block text-sm font-medium text-gray-700 mb-1">Estimated Ship Date: </p>
            <p>{{ order.estimatedShipDate }}</p>


            <p class="block text-sm font-medium text-gray-700 mb-1">Estimated Ship Time: </p>
            <p>{{ order.estimatedShipTime }}</p>
          </div>


  </div>

  <template #footer>
    <button
        v-if="step === 2"
        class="p-button p-component p-button-secondary"
        @click="prevStep"
    >
      Back
    </button>

    <button
        v-if="step === 1"
        class="p-button p-component p-button-primary"
        @click="nextStep"
    >
      Next
    </button>


    <button class="p-button p-component p-button-text" @click="$emit('close')">Close</button>
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

  .controls-section {
    flex-direction: column;
    align-items: center;
  }
}
</style>