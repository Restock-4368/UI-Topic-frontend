<script>
import BaseModal from './base-modal.component.vue';
import {Button as PvButton} from "primevue";

export default {
  name: 'DeleteConfirmation',
  components: {PvButton, BaseModal },
  props: {
    modelValue: { type: Boolean, required: true },
    label: { type: String, default: 'this item' },
  },
  emits: ['update:modelValue', 'cancel', 'confirm'],
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
      title="Confirm deletion"
      width="25rem"
      @close="$emit('cancel')"
  >
    <p class="mb-4">Are you sure you want to delete <strong>{{ label }}</strong>?</p>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button label="Cancel" severity="secondary" @click="$emit('cancel')" class="gray-button" />
        <pv-button label="Delete" icon="pi pi-trash" severity="danger" @click="$emit('confirm')" class="red-button"/>
      </div>
    </template>
  </BaseModal>
</template>

