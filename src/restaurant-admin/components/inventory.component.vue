<template>
  <div class="p-4">
    <div class="flex flex-column gap-4">
      <div class="surface-card shadow-2 p-4 border-round" style="flex: 0 0 30%;">
        <div class="flex justify-between align-items-center mb-4">
          <h1>Insumos</h1>
          <pv-button
              label="Crear"
              icon="pi pi-plus"
              @click="openCreateModal"
          />
        </div>

        <div v-if="supplies.length === 0" class="text-center">
          <p>Aún no has agregado insumos. Añádelos para comenzar a gestionar tu inventario.</p>
          <pv-button label="Crear Insumo" icon="pi pi-plus" class="mt-2" @click="showSupplyModal = true" />
        </div>

        <div v-else>
          <pv-carousel :value="supplies" :numVisible="3" :numScroll="1">
            <template #item="slotProps">
              <div class="border-1 surface-border border-round p-3 m-2 text-center">
                <h4>{{ slotProps.data.name }}</h4>
                <p class="text-sm">{{ slotProps.data.description }}</p>
                <p><strong>{{ slotProps.data.category }}</strong> - {{ slotProps.data.unit }}</p>
                <pv-button
                    icon="pi pi-pencil"
                    label="Editar"
                    size="small"
                    class="mt-2"
                    @click="openEditModal(slotProps.data)"
                />
              </div>
            </template>
          </pv-carousel>
        </div>
      </div>

      <div class="surface-card shadow-2 p-4 border-round" style="flex: 0 0 70%;">
        <div class="flex justify-between align-items-center mb-4">
          <h1 class="m-0">Inventory</h1>
          <div class="flex align-items-center gap-2">
            <pv-input-text v-model="search" placeholder="Buscar..." />
            <pv-button label="Añadir" icon="pi pi-plus" />
          </div>
          <div class="flex align-items-center gap-2">
            <span>1-5 de 10</span>
            <pv-button icon="pi pi-angle-left" text />
            <pv-button icon="pi pi-angle-right" text />
          </div>
        </div>

        <pv-data-table :value="inventory" responsiveLayout="scroll">
          <pv-column field="name" header="Insumos" />
          <pv-column field="category" header="Categoría" />
          <pv-column field="unit" header="Unidad de medida" />
          <pv-column field="expiry" header="Fecha de caducidad" />
          <pv-column field="stock" header="Stock" />
          <pv-column field="min" header="Stock Mínimo" />
          <pv-column field="max" header="Stock Máximo" />
          <pv-column field="perishable" header="Perecible" />
          <pv-column header="Acciones">
            <template #body>
              <pv-button icon="pi pi-pencil" text />
              <pv-button icon="pi pi-trash" text severity="danger" />
            </template>
          </pv-column>
        </pv-data-table>
      </div>
    </div>

    <inventorySupplyCreateAndEdit
        :visible="showSupplyModal"
        :isEdit="isEditing"
        :supplyToEdit="supplyToEdit"
        :categories="categories"
        :units="units"
        @create="createSupply"
        @update="updateSupply"
        @cancel="showSupplyModal = false"
        @update:visible="showSupplyModal = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import inventorySupplyCreateAndEdit from './inventory-supply-create-and-edit.component.vue';
const showSupplyModal = ref(false);
const search = ref('');

const isEditing = ref(false);
const supplyToEdit = ref(null);

const categories = ['Verduras', 'Carnes', 'Granos', 'Lácteos', 'Bebidas'];
const units = ['kg', 'l', 'unidades', 'g', 'ml'];

const openCreateModal = () => {
  isEditing.value = false;
  supplyToEdit.value = null;
  showSupplyModal.value = true;
  console.log(showSupplyModal.value);
};

const openEditModal = (supply) => {
  isEditing.value = true;
  supplyToEdit.value = { ...supply };
  showSupplyModal.value = true;
};

const supplies = ref([
  { name: 'Tomate', category: 'Verduras', unit: 'kg', description: 'Fresco y orgánico' },
  { name: 'Pollo', category: 'Carnes', unit: 'kg', description: 'Pechuga de pollo' },
  { name: 'Leche', category: 'Lácteos', unit: 'l', description: 'Entera' },
  { name: 'Papa', category: 'Verduras', unit: 'kg', description: 'Papa blanca' },
  { name: 'Carne molida', category: 'Carnes', unit: 'kg', description: 'Res' },
  { name: 'Agua mineral', category: 'Bebidas', unit: 'l', description: 'Sin gas' },
  { name: 'Yogurt', category: 'Lácteos', unit: 'l', description: 'Natural' },
  { name: 'Zanahoria', category: 'Verduras', unit: 'kg', description: 'Fresca' },
  { name: 'Lentejas', category: 'Granos', unit: 'kg', description: 'Secas' },
  { name: 'Cebolla', category: 'Verduras', unit: 'kg', description: 'Roja' }
]);

const inventory = ref([
  { name: 'Tomate', category: 'Verduras', unit: 'kg', expiry: '2025-06-01', stock: 20, min: 10, max: 50, perishable: 'Sí' },
  { name: 'Pollo', category: 'Carnes', unit: 'kg', expiry: '2025-05-20', stock: 15, min: 5, max: 30, perishable: 'Sí' },
  { name: 'Leche', category: 'Lácteos', unit: 'l', expiry: '2025-05-15', stock: 25, min: 10, max: 40, perishable: 'Sí' },
  { name: 'Papa', category: 'Verduras', unit: 'kg', expiry: '2025-06-10', stock: 30, min: 15, max: 60, perishable: 'Sí' },
  { name: 'Carne molida', category: 'Carnes', unit: 'kg', expiry: '2025-05-19', stock: 10, min: 5, max: 25, perishable: 'Sí' },
  { name: 'Agua mineral', category: 'Bebidas', unit: 'l', expiry: '2026-01-01', stock: 50, min: 20, max: 100, perishable: 'No' },
  { name: 'Yogurt', category: 'Lácteos', unit: 'l', expiry: '2025-05-18', stock: 18, min: 8, max: 30, perishable: 'Sí' },
  { name: 'Zanahoria', category: 'Verduras', unit: 'kg', expiry: '2025-06-12', stock: 22, min: 10, max: 45, perishable: 'Sí' },
  { name: 'Lentejas', category: 'Granos', unit: 'kg', expiry: '2025-12-01', stock: 40, min: 20, max: 60, perishable: 'No' },
  { name: 'Cebolla', category: 'Verduras', unit: 'kg', expiry: '2025-06-05', stock: 35, min: 15, max: 50, perishable: 'Sí' }
]);

const newSupply = ref({
  name: '',
  category: null,
  unit: null,
  description: ''
});

const createSupply = (newItem) => {
  supplies.value.push(newItem);
  showSupplyModal.value = false;
};

const updateSupply = (updatedItem) => {
  const index = supplies.value.findIndex(s => s.name === updatedItem.name); // puedes usar otro id si lo tienes
  if (index !== -1) {
    supplies.value[index] = { ...updatedItem };
  }
  showSupplyModal.value = false;
};


</script>
