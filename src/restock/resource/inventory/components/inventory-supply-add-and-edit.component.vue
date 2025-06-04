<template>
  <pv-dialog :header="isEdit ? 'Editar Registro de Insumo' : 'Agregar Insumo al Inventario'" :visible="visible"
    @update:visible="$emit('update:visible', $event)" modal class="w-4">
    <template #header>
      <div class="p-2">
        <h2 class="text-xl font-semibold">
          {{ isEdit ? 'Editar Registro de Insumo' : 'Agregar Insumo al Inventario' }}
        </h2>
        <p class="text-sm font-light text-gray-500">
          {{ isEdit
            ? 'Modifica la información del registro de inventario.'
            : 'Completa los detalles para agregar el insumo al inventario.' }}
        </p>
      </div>
    </template>

    <div class="p-2">
      <!-- Insumo -->
      <div>
        <label for="supply" class="block text-sm font-medium text-gray-700 mb-2">Insumo</label>
        <template v-if="!isEdit">
          <pv-dropdown id="supply" :options="supplies" optionLabel="name" v-model="form.supply"
            placeholder="Seleccionar insumo" class="w-full mb-3" />
        </template>
        <template v-else>
          <pv-input-text :value="form.supply?.name" disabled class="w-full mb-3" />
        </template>
      </div>

      <!-- Cantidad -->
      <div>
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
        <pv-input-number id="stock" v-model="form.stock" :min="0" mode="decimal" class="w-full mb-3"
          placeholder="Ej: 50" />
      </div>

      <!-- Fecha de expiración -->
      <div v-if="form.perishable">
        <label for="expiry" class="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
        <pv-calendar id="expiry" v-model="form.expiry" showIcon class="w-full mb-3" placeholder="Seleccionar fecha" />
      </div>

      <!-- Botones -->
      <div class="flex justify-content-around pt-4">
        <pv-button label="CANCELAR" icon="pi pi-times-circle" severity="danger" class="red-button" @click="cancel" />
        <pv-button :label="isEdit ? 'GUARDAR' : 'AÑADIR'" :icon="isEdit ? 'pi pi-pen-to-square' : 'pi pi-plus-circle'"
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
  supplies: Array,
  itemToEdit: {
    type: Object,
    default: () => ({
      supply: null,
      stock: 0,
      expiry: null
    })
  }
});

const emit = defineEmits(['update:visible', 'create', 'update', 'cancel']);

const form = ref({
  supply: null,
  stock: 0,
  expiry: null,
  perishable: false
});

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const resetForm = () => {
  form.value = {
    supply: null,
    stock: 0,
    expiry: null,
    perishable: false
  };
};

// Detectar si el insumo seleccionado es perecible
watch(() => form.value.supply, (selectedSupply) => {
  form.value.perishable = selectedSupply?.perishable === true;
});

// Cuando se pasa itemToEdit, llenar el formulario con los datos
watch(
  () => props.itemToEdit,
  (newVal) => {
    if (props.isEdit && newVal) {
      form.value = {
        supply: newVal.supply,
        stock: newVal.stock,
        expiry: newVal.expiry,
        perishable: newVal.supply?.perishable === true
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const submit = () => {
  if (!form.value.supply ||!form.value.supply.id) {
    alert('Por favor, seleccione un insumo válido');
    return;
  }

  const payload = {
    supply_id: form.value.supply.id,
    stock: form.value.stock,
    expiration_date: form.value.perishable ? formatDate(form.value.expiry) : null
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
