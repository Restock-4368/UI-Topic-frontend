<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "manage-new-orders",
  components: {BaseModal},
  props: {
    supplies: {
      type: Array,
      required: true,
    },
    suppliesPerOrder: {
      type: Array,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
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
  <base-modal model-value="internalVisible"
              :title="'New Order Management'"
              @close="$emit('close')"
  >
    <div class="p-4">
      <pv-data-table
          :value="suppliesPerOrder"
          paginator
          :rows="4"
          :rows-per-page-options="[4, 6, 8, 10]"
          responsive-layout="scroll"
      >
        <pv-column field="date" header="Product name">
          <template #body="{ data }">
            {{ data.date }}
          </template>
        </pv-column>

        <pv-column header="Quantity">
          <template #body="{ data }">
            {{ restaurantBusinessNamesPerOrder[data.id] }}
          </template>
        </pv-column>

        <pv-column header="Unit Measure">
          <template #body="{ data }">
            {{ suppliesPerOrderCount[data.id] }}
          </template>
        </pv-column>

      </pv-data-table>
    </div>

    <template #footer>
      <button class="p-button p-component p-button-text" @click="$emit('close')">Close</button>
    </template>
  </base-modal>

</template>

<style scoped>

</style>