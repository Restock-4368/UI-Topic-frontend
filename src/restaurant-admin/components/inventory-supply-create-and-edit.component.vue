<template>
  <pv-dialog
      :header="isEdit ? 'Editar Insumo' : 'Crear Insumo'"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      class="w-[38rem]"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold">
          {{ isEdit ? 'Editar Insumo' : 'Crear Insumo' }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ isEdit ? 'Modifica la información del insumo.' : 'Completa los detalles del nuevo insumo para añadirlo a tu lista.' }}
        </p>
      </div>
    </template>
    <div class="p-5 space-y-5">
      <!-- Nombre del insumo -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre de insumo</label>
        <pv-input-text id="name" v-model="form.name" placeholder="Ej: Tomate, Harina, Aceite..." class="w-full" />
      </div>

      <!-- Categoría -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <pv-dropdown
            id="category"
            :options="categories"
            v-model="form.category"
            placeholder="Seleccionar categoría"
            class="w-full"
        />
      </div>

      <!-- Unidad -->
      <div>
        <label for="unit" class="block text-sm font-medium text-gray-700 mb-1">Unidad de medida</label>
        <pv-dropdown
            id="unit"
            :options="units"
            v-model="form.unit"
            placeholder="Seleccionar unidad"
            class="w-full"
        />
      </div>

      <!-- Descripción -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
        <pv-input-text
            id="description"
            v-model="form.description"
            placeholder="Detalles adicionales del insumo..."
            class="w-full"
        />
      </div>

      <!-- Perecible -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">¿Perecible?</label>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <input
                type="radio"
                id="nonPerishable"
                value="No"
                v-model="form.perishable"
                class="accent-green-600"
            />
            <label for="nonPerishable" class="text-sm">No es perecible</label>
          </div>
          <div class="flex items-center gap-2">
            <input
                type="radio"
                id="perishable"
                value="Sí"
                v-model="form.perishable"
                class="accent-green-600"
            />
            <label for="perishable" class="text-sm">Sí es perecible</label>
          </div>
        </div>
      </div>

      <!-- Mínimo de stock -->
      <div>
        <label for="min" class="block text-sm font-medium text-gray-700 mb-1">Mínimo de stock</label>
        <pv-input-number
            id="min"
            v-model="form.min"
            :min="0"
            placeholder="Ej: 10"
            class="w-full"
        />
      </div>

      <!-- Máximo de stock -->
      <div>
        <label for="max" class="block text-sm font-medium text-gray-700 mb-1">Máximo de stock</label>
        <pv-input-number
            id="max"
            v-model="form.max"
            :min="0"
            placeholder="Ej: 100"
            class="w-full"
        />
      </div>

      <!-- Botones -->
      <div class="flex justify-between pt-4">
        <pv-button
            :label="isEdit ? 'Editar' : 'Crear'"
            class="bg-green-600 border-none text-white hover:bg-green-700 px-5"
            @click="submit"
        />
        <pv-button
            label="Cancelar"
            severity="danger"
            class="px-5"
            @click="cancel"
        />
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
      unit: null,
      perishable: 'No',
      min: 0,
      max: 0
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
  unit: null,
  perishable: 'No',
  min: 0,
  max: 0
});

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    category: null,
    unit: null,
    perishable: 'No',
    min: 0,
    max: 0
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
