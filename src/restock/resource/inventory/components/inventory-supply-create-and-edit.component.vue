<template>
  <pv-dialog :header="isEdit ? 'Editar Insumo' : 'Crear Insumo'" :visible="visible"
    @update:visible="$emit('update:visible', $event)" modal class="w-4">
    <template #header>
      <div class="p-2">
        <h2 class="text-xl font-semibold">
          {{ isEdit ? 'Editar Insumo' : 'Crear Insumo' }}
        </h2>
        <p class="text-sm font-light text-gray-500">
          {{ isEdit ? 'Modifica la información del insumo.' : 'Completa los detalles del nuevo insumo para añadirlo a tu lista.' }}
        </p>
      </div>
    </template>
    <div class="p-2">
      <!-- Nombre del insumo -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nombre de insumo</label>
        <pv-input-text id="name" v-model="form.name" placeholder="Ej: Tomate, Harina, Aceite..." class="w-full mb-3" />
      </div>

      <!-- Categoría -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
        <pv-dropdown id="category" :options="categories" optionLabel="name" optionValue="id" v-model="form.category_id"
          placeholder="Seleccionar categoría" class="w-full  mb-3" />
      </div>

      <!-- Unidad -->
      <div>
        <label for="unit" class="block text-sm font-medium text-gray-700 mb-2">Unidad de medida</label>
        <pv-dropdown id="unit" :options="units" optionLabel="name" optionValue="id" v-model="form.unit_measurement_id"
          placeholder="Seleccionar unidad" class="w-full  mb-3" />
      </div>

      <!-- Descripción -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
        <pv-input-text id="description" v-model="form.description" placeholder="Detalles adicionales del insumo..."
          class="w-full  mb-3" />
      </div>

      <!-- Perecible -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">¿Perecible?</label>
        <div class="flex flex-column gap-4 mb-3">
          <div class="flex items-center gap-2">
            <input type="radio" id="nonPerishable" :value="false" v-model="form.perishable" class="accent-green-600" />
            <label for="nonPerishable" class="text-sm">No es perecible</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="radio" id="perishable" :value="true" v-model="form.perishable" class="accent-green-600" />
            <label for="perishable" class="text-sm">Sí es perecible</label>
          </div>
        </div>
      </div>

      <!-- Mínimo de stock -->
      <div v-if="props.role === 'admin'">
        <label for="min_stock" class="block text-sm font-medium text-gray-700 mb-2">Mínimo de stock</label>
        <pv-input-number id="min_stock" v-model="form.min_stock" :min="0" placeholder="Ej: 10" class="w-full  mb-3" />
      </div>

      <!-- Máximo de stock -->
      <div v-if="props.role === 'admin'">
        <label for="max_stock" class="block text-sm font-medium text-gray-700 mb-2">Máximo de stock</label>
        <pv-input-number id="max_stock" v-model="form.max_stock" :min="0" placeholder="Ej: 100" class="w-full  mb-3" />
      </div>

      <div v-if="props.role !== 'admin'">
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">Precio unitario ($)</label>
        <pv-input-number id="price" v-model="form.price" mode="currency" currency="USD" locale="en-US" :min="0"
          :step="0.01" placeholder="Ej: 3.50" class="w-full mb-3" />
      </div>

      <!-- Botones -->
      <div class="flex justify-content-around pt-4">
        <pv-button label="CANCELAR" icon="pi pi-times-circle" severity="danger" class="red-button" @click="cancel" />
        <pv-button :label="isEdit ? 'GUARDAR' : 'CREAR'" :icon="isEdit ? 'pi pi-pen-to-square' : 'pi pi-save'"
          class="green-button" @click="submit" />
      </div>
    </div>
  </pv-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  role: {
    type: String,
    default: 'admin'
  },

  supplyToEdit: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      unit_measurement_id: null,
      category_id: null,
      category: null,
      unit: null,
      perishable: 'No',
      min_stock: 0,
      max_stock: 0
    })
  },
  categories: Array,
  units: Array
});
const emit = defineEmits(['update:visible', 'create', 'update', 'cancel']);

const form = ref({
  name: '',
  description: '',
  category_id: null,
  unit_measurement_id: null,
  category: null,
  unit: null,
  perishable: false,
  min_stock: 0,
  max_stock: 0,
  price: null
});

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    category_id: null,
    unit_measurement_id: null,
    category: null,
    unit: null,
    perishable: false,
    min_stock: 0,
    max_stock: 0,
    price: null
  };
};

watch(
  () => props.supplyToEdit,
  (newVal) => {
    if (props.isEdit && newVal) {
      form.value = {
        name: newVal.name || '',
        description: newVal.description || '',
        category_id: newVal.category_id || null,
        unit_measurement_id: newVal.unit_measurement_id || null,
        category: newVal.category_id || null,
        unit: newVal.unit_measurement_id || null,
        perishable: newVal.perishable === true,
        min_stock: newVal.min_stock || null,
        max_stock: newVal.max_stock || null,
        price: newVal.price || null
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const submit = () => {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    category_id: form.value.category_id,
    unit_measurement_id: form.value.unit_measurement_id,
    category: props.categories.find(c => c.id === form.value.category)?.name ?? '',
    unit: props.units.find(u => u.id === form.value.unit)?.name ?? '',
    perishable: form.value.perishable,
    min_stock: form.value.min_stock,
    max_stock: form.value.max_stock,
    price: form.value.price
  };


  props.isEdit ? emit('update', payload) : emit('create', payload);
  resetForm();
  emit('update:visible', false);
};

const cancel = () => {
  resetForm();
  emit('cancel');
  emit('update:visible', false);
};
</script>
