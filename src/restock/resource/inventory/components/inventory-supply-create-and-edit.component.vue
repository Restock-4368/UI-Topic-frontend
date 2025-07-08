<template>
  <pv-dialog
    :header="isEdit ? $t('inventory.supplies-catalog-create-and-edit-modal.edit-title') : $t('inventory.supplies-catalog-create-and-edit-modal.create-title')"
    :visible="visible" @update:visible="$emit('update:visible', $event)" modal
    :style="{ width: '95vw', maxWidth: '600px' }">
    <template #header>
      <div style="padding: 1rem;">
        <h2 style="font-size: 1.25rem; font-weight: 600;">
          {{ isEdit ? $t('inventory.supplies-catalog-create-and-edit-modal.edit-title') :
            $t('inventory.supplies-catalog-create-and-edit-modal.create-title') }}
        </h2>
        <p style="font-size: 0.875rem; color: #6b7280;">
          {{ isEdit ? $t('inventory.supplies-catalog-create-and-edit-modal.edit-subtitle') :
            $t('inventory.supplies-catalog-create-and-edit-modal.create-subtitle') }}
        </p>
      </div>
    </template>

    <div style="padding: 1rem;">
      <!-- Campos del formulario -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Nombre -->
        <div>
          <label for="name" class="form-label">{{ $t('inventory.supplies-catalog-create-and-edit-modal.supply-name')
            }}</label>
          <pv-input-text id="name" v-model="form.name"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.supply-name-placeholder')"
            class="w-full" />
        </div>

        <!-- Categoría -->
        <div>
          <label for="category" class="form-label">{{
            $t('inventory.supplies-catalog-create-and-edit-modal.supply-category')
            }}</label>
          <pv-dropdown id="category" :options="categories" optionLabel="name" optionValue="id"
            v-model="form.category_id"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.supply-category-placeholder')"
            class="w-full" />
        </div>

        <!-- Unidad -->
        <div>
          <label for="unit" class="form-label">{{ $t('inventory.supplies-catalog-create-and-edit-modal.unit-of-measure')
            }}</label>
          <pv-dropdown id="unit" :options="units" optionLabel="name" optionValue="id" v-model="form.unit_measurement_id"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.unit-of-measure-placeholder')"
            class="w-full" />
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="form-label">{{
            $t('inventory.supplies-catalog-create-and-edit-modal.description')
            }}</label>
          <pv-input-text id="description" v-model="form.description"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.description-placeholder')"
            class="w-full" />
        </div>

        <!-- Perecible -->
        <div>
          <label class="form-label">{{ $t('inventory.supplies-catalog-create-and-edit-modal.pereshible') }}</label>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="radio" id="nonPerishable" :value="false" v-model="form.perishable" />
              {{ $t('inventory.supplies-catalog-create-and-edit-modal.is-not-perishable') }}
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="radio" id="perishable" :value="true" v-model="form.perishable" />
              {{ $t('inventory.supplies-catalog-create-and-edit-modal.is-perishable') }}
            </label>
          </div>
        </div>

        <!-- Stock mínimo y máximo -->
        <div v-if="props.role === 'admin'">
          <label for="min_stock" class="form-label">{{
            $t('inventory.supplies-catalog-create-and-edit-modal.minimum-stock')
            }}</label>
          <pv-input-number id="min_stock" v-model="form.min_stock" :min="0"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.minimum-stock-placeholder')"
            class="w-full" />
        </div>
        <div v-if="props.role === 'admin'">
          <label for="max_stock" class="form-label">{{
            $t('inventory.supplies-catalog-create-and-edit-modal.maximum-stock')
            }}</label>
          <pv-input-number id="max_stock" v-model="form.max_stock" :min="0"
            :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.maximum-stock-placeholder')"
            class="w-full" />
        </div>

        <!-- Precio (solo proveedor) -->
        <div v-if="props.role !== 'admin'">
          <label for="price" class="form-label">{{ $t('inventory.supplies-catalog-create-and-edit-modal.price')
            }}</label>
          <pv-input-number id="price" v-model="form.price" mode="currency" currency="USD" locale="en-US" :min="0"
            :step="0.01" :placeholder="$t('inventory.supplies-catalog-create-and-edit-modal.price-placeholder')"
            class="w-full" />
        </div>
      </div>

      <!-- Botones -->
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
        <pv-button :label="$t('inventory.cancel-button')" icon="pi pi-times-circle" severity="danger" class="red-button"
          @click="cancel" />
        <pv-button :label="isEdit ? $t('inventory.save-button') : $t('inventory.create-button')"
          :icon="isEdit ? 'pi pi-pen-to-square' : 'pi pi-save'" class="green-button" @click="submit" />
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

<style>
.form-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Responsive ajustes opcionales */
@media (max-width: 480px) {
  .form-label {
    font-size: 0.8rem;
  }

  .red-button,
  .green-button {
    flex: 1 1 100%;
  }
}
</style>