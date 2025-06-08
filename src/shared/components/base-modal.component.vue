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
      :header="title"
      :closable="false"
      :style="{ width: width }"
      @update:visible="$emit('update:modelValue', $event)"
      @hide="$emit('close')"
  >
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </pv-dialog>
</template>
