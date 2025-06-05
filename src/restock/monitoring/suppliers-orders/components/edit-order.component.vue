<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "edit-order",
  components: {BaseModal},
  // props: {
  //   order: {
  //     type: [Object, null],
  //     required: true,
  //   },
  //   situation: {
  //     type: String,
  //     default: "Approved",
  //   },
  //   state: {
  //     type: String,
  //     default: "Preparing",
  //   },
  //
  // },
  data() {
    return {
      steps: ["On hold", "Preparing", "On the way", "Delivered"],
      currentIndex: 1, // ejemplo: "Preparing"
      draggingIndex: null
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleDragStart(index) {
      // Lógica para drag start si es necesario
      console.log('Drag start from index:', index);
    },
    handleDrop(index) {
      this.currentIndex = index;
      console.log('Dropped at index:', index);
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
              :title="'Update Order'"
              @close="$emit('close')"
  >
    <div class="situation">
      <label class="block text-sm font-bold text-gray-700 mb-1">
        Situation
        <pv-chip class=" text-sm ml-1 mt-1 mb-1">Approved</pv-chip>
      </label>

    </div>


    <div class="p-4">
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
              @drop="handleDrop(index)"
          >
            <!-- Truck -->
            <div
                v-if="currentIndex === index"
                class="truck-container"
                draggable="true"
                @dragstart="handleDragStart(index)"
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

    <div class="information">
      <h3>Estimated Hour</h3>
      <label for="expiry" class="block text-sm font-medium text-gray-700 mb-1">Estimated Shipping Date</label>
      <pv-calendar
          id="expiry"
          showIcon
          class="w-full mb-3"
          placeholder="Seleccionar fecha"
      />

      <label for="shipTime" class="block text-sm font-medium text-gray-700 mb-1">
        Estimated Shipping Time
      </label>
      <pv-calendar
          id="shipTime"
          timeOnly
          hourFormat="24"
          showIcon
          class="w-full mb-3"
          placeholder="Seleccionar hora"
      />

      <p class="block text-sm font-medium text-gray-700 mb-1">Order Description: </p>
      <p>Description here</p>

    </div>

    <template #footer>

      <button
          class="p-button p-component p-button-success"
          @click="submitOrder"
      >
        Accept selection
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
  cursor: grab;
  animation: bounce 2s infinite;
}

.truck-container:active {
  cursor: grabbing;
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


/* Animations */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
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