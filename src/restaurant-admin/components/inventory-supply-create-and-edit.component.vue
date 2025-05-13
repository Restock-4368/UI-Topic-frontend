<template>
  <pv-dialog
      :header="isEdit ? 'Editar Insumo' : 'Crear Insumo'"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      class="w-4"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="name">Nombre</label>
        <pv-input-text id="name" v-model="form.name" />
      </div>

      <div class="field">
        <label for="description">Descripción</label>
        <pv-input-text id="description" v-model="form.description" />
      </div>

      <div class="field">
        <label for="category">Categoría</label>
        <pv-dropdown
            id="category"
            :options="categories"
            v-model="form.category"
            placeholder="Seleccionar categoría"
        />
      </div>

      <div class="field">
        <label for="unit">Unidad</label>
        <pv-dropdown
            id="unit"
            :options="units"
            v-model="form.unit"
            placeholder="Seleccionar unidad"
        />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <pv-button label="Cancelar" severity="secondary" @click="cancel" />
        <pv-button :label="isEdit ? 'Actualizar' : 'Crear'" @click="submit" />
      </div>
    </div>
  </pv-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  supplyToEdit: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      category: null,
      unit: null
    })
  },
  categories: Array,
  units: Array
});

const emit = defineEmits(['update:visible', 'create', 'update', 'cancel']);

const form = ref({
  name: '',
  description: '',
  category: null,
  unit: null
});

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    category: null,
    unit: null
  };
};

watch(
    () => props.supplyToEdit,
    (newVal) => {
      if (props.isEdit && newVal) {
        form.value = { ...newVal };
      } else {
        resetForm();
      }
    },
    { immediate: true }
);

const submit = () => {
  props.isEdit ? emit('update', form.value) : emit('create', form.value);
  resetForm();
  emit('update:visible', false);
};

const cancel = () => {
  resetForm();
  emit('cancel');
  emit('update:visible', false);
};
</script>
