<script>
import {Dialog as PvDialog} from "primevue";

export default {
  name: 'BaseModal',
  components: {PvDialog},
  props: {
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: '' },
    width: { type: String, default: '35rem' },
    closable: { type: Boolean, default: true },
  },
  emits: ['update:modelValue', 'close'],
};
</script>


<template>
  <pv-dialog
      :visible="modelValue"
      :modal="true"
      :header="false"
      :closable="false"
      :style="{ width: width }"
      @update:visible="$emit('update:modelValue', $event)"
      @hide="$emit('close')"
  >

    <div class="modal-header flex justify-between items-start w-full mb-4">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <pv-button
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-sm ml-auto"
          @click="$emit('close')"
      />
    </div>

    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </pv-dialog>
</template>
