<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";
import {DatePicker as PvDatePicker} from "primevue";

export default {
  name: "edit-order",
  components: {PvDatePicker, BaseModal},
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    order: {
      type: [Object, null],
      required: true,
    },
    state: {
      type: [Object, null],
      required: true,
    },
    situation: {
      type: [Object, null],
      required: true,
    }
  },
  data() {
    return {
      statusToStepIndex: {
        1: 0,  // -> "On hold"
        2: 1,  //  -> "Preparing"
        3: 2,  // -> "On the way"
        4: 3,  //  -> "Delivered"
      },
      stepIndexToStatus: {
        0: 1,  // "On hold"
        1: 2,  // "Preparing"
        2: 3,  // "On the way"
        3: 4,  // "Delivered"
      },
      currentIndex: 0, // Current state
      draggingIndex: null,
      localOrder: {
        description: '',
        estimatedShipDate: null,
        estimatedShipTime: null
      }
    };
  },
  emits: ['close', 'submit-order', 'update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false); // esto cierra el modal desde el padre
      this.$emit('close', false);
    },
    handleDrop(index) {
      this.currentIndex = index;
    },
    resetForm() {
      this.currentIndex = null;
      this.draggingIndex = null;
      this.localOrder = {
        description: '',
        estimatedShipDate: null,
        estimatedShipTime: null
      };
    },
    initializeCurrentState() {
      if (this.state && this.state.id) {
        this.currentIndex = this.statusToStepIndex[this.state.id] || 0;
      } else if (this.order && this.order.stateId) {
        this.currentIndex = this.statusToStepIndex[this.order.stateId] || 0;
      } else {
        this.currentIndex = 0; // Default: "On hold"
      }
    },
    async submitOrder() {

      const updateData = {
        order: this.order,
        newEstimatedShipDate: this.localOrder.estimatedShipDate? this.localOrder.estimatedShipDate : this.order.estimatedShipDate,
        newEstimatedShipTime: this.localOrder.estimatedShipTime? this.localOrder.estimatedShipTime : this.order.estimatedShipTime,
        newDescription: this.localOrder.description? this.localOrder.description : this.order.description,
        newState: this.stepIndexToStatus[this.currentIndex]? this.stepIndexToStatus[this.currentIndex] : this.order.stateId,
      };

      this.$emit('submit-order', updateData);
      this.resetForm();
      this.close();
    },
  },

  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.resetForm();
        this.initializeCurrentState();
      }
    },
    state: {
      handler(newState) {
        if (this.modelValue && newState) {
          this.initializeCurrentState();
        }
      },
      deep: true
    },
    order: {
      handler(newOrder) {
        if (newOrder) {
          this.initializeCurrentState();
          this.localOrder = {
            ...newOrder,
            estimatedShipDate: newOrder.estimatedShipDate || null,
            estimatedShipTime: newOrder.estimatedShipTime || null
          };
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    steps() {
      return [
        this.$t('supplier-orders.state.on-hold'),
        this.$t('supplier-orders.state.preparing'),
        this.$t('supplier-orders.state.on-the-way'),
        this.$t('supplier-orders.state.delivered')
      ];
    },
    internalVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  mounted() {
    if (this.modelValue) {
      this.initializeCurrentState();
    }
  }
}
</script>

<template>
  <base-modal :model-value="modelValue"
              :title="'Update Order'"
              @close="close"
  >
    <div class="situation">
      <p class="block text-sm font-bold text-gray-700 mb-1">
        {{ $t('supplier-orders.situation.title') }}
        <pv-chip class=" text-sm ml-1 mt-1 mb-1">{{ $t('supplier-orders.situation.approved') }}</pv-chip>
      </p>
    </div>

    <div class="modal-content">

      <p class="subtitle">{{ $t('supplier-orders.update-order.description') }}</p>

      <h4 class="section-title">{{ $t('supplier-orders.state.title') }}</h4>

      <!-- Stepper container -->
      <div class="stepper-container">
        <!-- Main progress line -->
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
            >
              <i class="pi pi-truck truck-icon"></i>
            </div>

            <!-- Points -->
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

      <!-- Description -->
      <div class="section-description">
        <p class="block text-sm font-medium text-gray-700 mt-3 mb-2">{{ $t('supplier-orders.description') }}</p>
        <pv-input-text id="description" v-model="localOrder.description"
                       :placeholder="$t('supplier-orders.placeholder.description')"
                       class="description-input"  />
      </div>

    </div>

    <template #footer>
      <div class="modal-footer">
        <button class="btn btn-close" @click="close">{{ $t('supplier-orders.manage-new-orders.buttons.close') }}</button>

        <button
            class="btn btn-accept"
            @click="submitOrder"
        >
          {{ $t('supplier-orders.update-order.buttons.save') }}
        </button>

      </div>

    </template>

  </base-modal>
</template>

<style scoped>
.stepper-container {
  position: relative;
  padding: 1rem 0;
}

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

.description-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
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

.btn {
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  gap: 12px;
  flex: 0 0 auto;
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
</style>