

<script>
import {SupplyService} from "../../resource/inventory/services/supply.service.js";

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
    };
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
    this.availableSupplies = await service.getAll();
  },
  methods: {
    addSupply() {
      if (!this.selectedSupply || !this.selectedQuantity) return;

      const exists = this.supplies.find(s => s.supply_id === this.selectedSupply.id);
      if (exists) return;

      const newSupply = {
        supply_id: this.selectedSupply.id,
        description: this.selectedSupply.description,
        quantity: this.selectedQuantity
      };

      this.supplies = [...this.supplies, newSupply];

      // Reset
      this.selectedSupply = null;
      this.selectedQuantity = null;
    },
    removeSupply(index) {
      this.supplies = this.supplies.filter((_, i) => i !== index);
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
          {{ option.description }}
        </template>

        <template #value="{ value }">
          {{ value?.description || 'Select supply' }}
        </template>

      </pv-select>

      <pv-input-number
          v-model="selectedQuantity"
          placeholder="Qty"
          class="w-6rem"
          inputClass="w-full"
      />

      <pv-button icon="pi pi-plus" @click="addSupply"  class="green-button"/>
    </div>

    <pv-data-table :value="supplies" class="p-datatable-sm" responsiveLayout="scroll">
      <pv-column field="description" header="Supply" />
      <pv-column field="quantity" header="Qty" />
      <pv-column header="Actions">
        <template #body="{ rowIndex }">
          <pv-button
              icon="pi pi-trash"
              severity="danger"
              outlined
              @click="removeSupply(rowIndex)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>


