<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "manage-new-orders",
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
      checkedSupplies: [], // almacena supplyId de los seleccionados
      selectAll: false,
      step: 1,
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
    toggleSelectAll() {
      if (this.selectAll) {
        this.checkedSupplies = this.suppliesPerOrder.map(item => item.supplyId);
      } else {
        this.checkedSupplies = [];
      }
    },
    close() {
      this.$emit('close');
    },
  },
  watch: {
    checkedSupplies(newVal) {
      this.selectAll = newVal.length === this.suppliesPerOrder.length;
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
              :title="'New Order Management'"
              @close="$emit('close')"
  >

    <div class="p-4">

        <p>Complete the order details to start tracking your order. </p>

      <div v-if="step === 1">
        <h4>Supplies</h4>
        <p>Select the supplies you have available for the order.</p>

        <div class="check-all">
          <label class="ml-2 mr-2">Select All</label>
          <pv-check-box
              v-model="selectAll"
              :binary="true"
              @change="toggleSelectAll"
          />
        </div>
        <pv-data-table
            :value="suppliesPerOrder"
            paginator
            :rows="4"
            :rows-per-page-options="[4, 6, 8, 10]"
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

          <pv-column >
            <template #body="{ data }">
              <pv-check-box
                  :value="data.supplyId"
                  v-model="checkedSupplies"
                  :binary="false"
              />
            </template>
          </pv-column>
        </pv-data-table>

        <p>Total Price: {{ order.totalPrice }}</p>

        <p>Order Description: </p>
        <p>{{ order.description }}</p>

      </div>

      <!-- Paso 2: Vista de resumen -->
      <div v-else-if="step === 2">
        <h3 class="mb-2">Order Summary</h3>
        <ul>
          <li v-for="id in checkedSupplies" :key="id">
            {{ productName(id) }} ({{ productUnitMeasurement(id) }})
          </li>
        </ul>
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

      <button
          v-if="step === 2"
          class="p-button p-component p-button-success"
          @click="submitOrder"
      >
        Confirm
      </button>

      <button class="p-button p-component p-button-text" @click="close">
        Close
      </button>

      <button class="p-button p-component p-button-text" @click="$emit('close')">Close</button>
    </template>
  </base-modal>

</template>

<style scoped>
.check-all {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem; /* opcional para separación visual */
}
</style>