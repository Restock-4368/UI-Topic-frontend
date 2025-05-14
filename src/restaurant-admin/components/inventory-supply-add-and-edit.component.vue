<template>
  <pv-dialog
      :header="isEdit ? 'Editar Registro de Insumo' : 'Agregar Insumo al Inventario'"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      class="w-4"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="supply">Insumo</label>
        <template v-if="!isEdit">
          <pv-dropdown
              id="supply"
              :options="supplies"
              optionLabel="name"
              v-model="form.supply"
              placeholder="Seleccionar insumo"
          />
        </template>
        <template v-else>
          <pv-input-text
              :value="form.supply?.name"
              disabled
          />
        </template>
      </div>

      <div class="field">
        <label for="stock">Cantidad</label>
        <pv-input-number
            id="stock"
            v-model="form.stock"
            :min="0"
            mode="decimal"
            inputStyle="width: 100%"
        />
      </div>

      <div class="field">
        <label for="provider">Proveedor (opcional)</label>
        <pv-dropdown
            id="provider"
            :options="providers"
            v-model="form.provider"
            placeholder="Seleccionar proveedor"
        />
      </div>

      <div class="field" v-if="isPerishable">
        <label for="expiry">Fecha de caducidad</label>
        <pv-calendar id="expiry" v-model="form.expiry" dateFormat="yy-mm-dd" showIcon />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <pv-button label="Cancelar" severity="secondary" @click="cancel" />
        <pv-button :label="isEdit ? 'Actualizar' : 'Agregar'" @click="submit" />
      </div>
    </div>
  </pv-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isPerishable: {
    type: Boolean,
    default: false
  },
  supplies: {
    type: Array,
    default: () => []
  },
  providers: {
    type: Array,
    default: () => []
  },
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

const localVisible = ref(props.visible);
const computedVisible = computed({
  get: () => localVisible.value,
  set: (val) => {
    localVisible.value = val;
    emit('update:visible', val);
  }
});

const form = ref({
  supply: null,
  stock: 0,
  provider: null,
  expiry: null
});

const resetForm = () => {
  form.value = {
    supply: null,
    stock: 0,
    provider: null,
    expiry: null
  };
};

const handleVisibilityChange = (val) => {
  computedVisible.value = val;
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
  if (props.isEdit) {
    emit('update', form.value);
  } else {
    emit('create', form.value);
  }
  resetForm();
  computedVisible.value = false;
};

const cancel = () => {
  resetForm();
  emit('cancel');
  computedVisible.value = false;
};
</script>
