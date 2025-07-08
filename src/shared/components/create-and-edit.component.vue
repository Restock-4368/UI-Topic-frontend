<script>
import BaseModal from './base-modal.component.vue';
import {Button as PvButton} from "primevue";

export default {
  name: 'CreateAndEdit',
  components: {PvButton, BaseModal },
  props: {
    modelValue: { type: Boolean, required: true },
    mode: { type: String, default: 'create' },
    createTitle: { type: String, default: 'Create' },
    editTitle: { type: String, default: 'Edit' },
  },
  emits: ['update:modelValue', 'close', 'save'],
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
};
</script>


<template>
  <BaseModal
      v-model="internalVisible"
      :title="mode === 'create' ? createTitle : editTitle"
      @close="$emit('close')"
  >
    <slot />
  </BaseModal>
</template>
