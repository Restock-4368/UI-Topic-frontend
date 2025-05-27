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

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button label="Cancel" severity="secondary" @click="$emit('close')" />
        <pv-button :label="mode === 'create' ? 'Save' : 'Update'" icon="pi pi-check" @click="$emit('save')" />
      </div>
    </template>
  </BaseModal>
</template>
