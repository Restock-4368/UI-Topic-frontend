<script>
import {SupplyService} from "../../resource/inventory/services/supply.service.js";
import {SupplyAssembler} from "../../resource/inventory/services/supply.assembler.js";

export default {
  name: 'SupplySelector',
  props: {
    modelValue: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      availableSupplies: [],
      selectedSupply: null,
      selectedQuantity: null,
      internalValue: [...(this.modelValue || [])]
    };
  },

  watch: {
    internalValue: {
      handler(newVal) {
        this.$emit('update:modelValue', newVal);
      },
      deep: true
    }
  },
  computed: {
    supplies: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
  async created() {
    const service = new SupplyService();
    const response = await service.getAll();
    this.availableSupplies = SupplyAssembler.toEntitiesFromResponse(response);
  },
  methods: {
    addSupply() {
      const exists = this.internalValue.some(s => s.supply_id === this.selectedSupply?.id);
      if (!exists) {
        this.internalValue.push({
          supply_id: this.selectedSupply.id,
          quantity: this.selectedQuantity
        });
      }
      this.selectedSupply = null;
      this.selectedQuantity = null;
    },
    removeSupply(index) {
      this.internalValue.splice(index, 1);
    },
    getSupplyName(id) {
      const match = this.availableSupplies.find(s => s.id === id);
      return match ? match.name : 'Unknown';
    }
  }
};
</script>

<template>
  <div class="supply-selector">
    <div class="flex align-items-center gap-2 mb-3">
      <pv-select
          v-model="selectedSupply"
          :options="availableSupplies"
          placeholder="Select supply"
          class="w-full"
      >
        <template #option="{ option }">
          {{ option.name }}
        </template>

        <template #value="{ value }">
          {{ value?.name || 'Select supply' }}
        </template>

      </pv-select>

      <pv-input-number
          v-model="selectedQuantity"
          placeholder="Qty"
          class="w-6rem"
          inputClass="w-full"
      />

      <pv-button icon="pi pi-plus-circle" @click="addSupply"  class="green-button" :disabled="!selectedSupply || !selectedQuantity"/>
    </div>

    <pv-data-table :value="internalValue" class="w-full">
      <pv-column field="supply_id" header="ID" />
      <pv-column field="description" header="Supply">
        <template #body="slotProps">
          {{ getSupplyName(slotProps.data.supply_id) }}
        </template>
      </pv-column>
      <pv-column field="quantity" header="Quantity" />
      <pv-column header="Actions">
        <template #body="slotProps">
          <pv-button icon="pi pi-trash" @click="removeSupply(slotProps.index)" severity="danger" text />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>


