<template>
  <pv-dialog
      :header="isEdit ? 'Editar Registro de Insumo' : 'Agregar Insumo al Inventario'"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      class="w-[38rem]"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold">
          {{ isEdit ? 'Editar Registro de Insumo' : 'Agregar Insumo al Inventario' }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ isEdit
            ? 'Modifica la información del registro de inventario.'
            : 'Completa los detalles para agregar el insumo al inventario.' }}
        </p>
      </div>
    </template>

    <div class="p-5 space-y-5">
      <!-- Insumo -->
      <div>
        <label for="supply" class="block text-sm font-medium text-gray-700 mb-1">Insumo</label>
        <template v-if="!isEdit">
          <pv-dropdown
              id="supply"
              :options="supplies"
              optionLabel="name"
              v-model="form.supply"
              placeholder="Seleccionar insumo"
              class="w-full"
          />
        </template>
        <template v-else>
          <pv-input-text
              :value="form.supply?.name"
              disabled
              class="w-full"
          />
        </template>
      </div>

      <!-- Cantidad -->
      <div>
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
        <pv-input-number
            id="stock"
            v-model="form.stock"
            :min="0"
            mode="decimal"
            class="w-full"
            placeholder="Ej: 50"
        />
      </div>

      <!-- Proveedor -->
      <div>
        <label for="provider" class="block text-sm font-medium text-gray-700 mb-1">Proveedor (opcional)</label>
        <pv-dropdown
            id="provider"
            :options="providers"
            v-model="form.provider"
            placeholder="Seleccionar proveedor"
            class="w-full"
        />
      </div>

      <!-- Fecha de expiración -->
      <div v-if="form.perishable">
        <label for="expiry" class="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
        <pv-calendar
            id="expiry"
            v-model="form.expiry"
            showIcon
            class="w-full"
            placeholder="Seleccionar fecha"
        />
      </div>

      <!-- Botones -->
      <div class="flex justify-between pt-4">
        <pv-button
            :label="isEdit ? 'Actualizar' : 'Agregar'"
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
import { ref, watch, computed } from 'vue';

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  isPerishable: Boolean,
  supplies: Array,
  providers: Array,
  itemToEdit: {
    type: Object,
    default: () => ({
      supply: null,
      stock: 0,
      provider: null,
      expiry: null
    })
  }
});

const emit = defineEmits(['update:visible', 'create', 'update', 'cancel']);

const form = ref({
  supply: null,
  stock: 0,
  provider: null,
  expiry: null,
  perishable: false
});

watch(() => form.value.supply, (selectedSupply) => {
  form.value.perishable = selectedSupply?.perishable === 'Sí';
});

const resetForm = () => {
  form.value = {
    supply: null,
    stock: 0,
    provider: null,
    expiry: null,
    perishable: false
  };
};

watch(
    () => props.itemToEdit,
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
  if (!form.value.supply) {
    alert('Por favor, seleccione un insumo');
    return;
  }

  const expiryStr = formatDate(form.value.expiry);

  const newItem = {
    name: form.value.supply.name,
    category: form.value.supply.category,
    unit: form.value.supply.unit,
    stock: form.value.stock,
    min: form.value.supply.min,
    max: form.value.supply.max,
    perishable: form.value.supply.perishable,
    expiry: form.value.perishable ? expiryStr : null
  };

  props.isEdit ? emit('update', newItem) : emit('create', newItem);

  resetForm();
  emit('update:visible', false);
};

const cancel = () => {
  resetForm();
  emit('cancel');
  emit('update:visible', false);
};
</script>
