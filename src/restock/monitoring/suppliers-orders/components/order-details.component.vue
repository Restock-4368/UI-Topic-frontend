<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";

export default {
  name: "order-details",
  components: {BaseModal},
  data() {
    return {
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
  :title="'Update Order'"
  @close="$emit('close')"
  >

  <div class="p-4">

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
      Accept selection
    </button>
    <button class="p-button p-component p-button-text" @click="$emit('close')">Close</button>
  </template>
  </base-modal>
</template>

<style scoped>

</style>