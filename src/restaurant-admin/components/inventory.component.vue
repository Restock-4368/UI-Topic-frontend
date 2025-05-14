<script>
import inventorySupplyCreateAndEdit from './inventory-supply-create-and-edit.component.vue';
import inventorySupplyAddAndEdit from './inventory-supply-add-and-edit.component.vue';
export default {
  name: 'InventoryComponent',
  components: {
    inventorySupplyCreateAndEdit,
    inventorySupplyAddAndEdit
  },
  data() {
    return {
      showSupplyModal: false,
      search: '',
      showInventoryModal: false,
      selectedInventoryItem: null,
      isEditing: false,
      supplyToEdit: null,
      newSupply: {
        name: '',
        category: null,
        unit: null,
        description: ''
      },
      categories: ['Verduras', 'Carnes', 'Granos', 'Lácteos', 'Bebidas'],
      units: ['kg', 'l', 'unidades', 'g', 'ml'],
      supplies: [
        { name: 'Tomate', category: 'Verduras', unit: 'kg', description: 'Fresco y orgánico',perishable: 'Sí' },
        { name: 'Pollo', category: 'Carnes', unit: 'kg', description: 'Pechuga de pollo', perishable: 'Sí' },
        { name: 'Leche', category: 'Lácteos', unit: 'l', description: 'Entera', perishable: 'Sí' },
        { name: 'Papa', category: 'Verduras', unit: 'kg', description: 'Papa blanca', perishable: 'Sí' },
        { name: 'Carne molida', category: 'Carnes', unit: 'kg', description: 'Res', perishable: 'Sí' },
        { name: 'Agua mineral', category: 'Bebidas', unit: 'l', description: 'Sin gas', perishable: 'No' },
        { name: 'Yogurt', category: 'Lácteos', unit: 'l', description: 'Natural', perishable: 'No' },
        { name: 'Zanahoria', category: 'Verduras', unit: 'kg', description: 'Fresca', perishable: 'Sí' },
        { name: 'Lentejas', category: 'Granos', unit: 'kg', description: 'Secas', perishable: 'Sí' },
        { name: 'Cebolla', category: 'Verduras', unit: 'kg', description: 'Roja', perishable: 'Sí' }
      ],
      inventory: [
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
      ],
      providers :['Proveedor A', 'Proveedor B', 'Proveedor C'],
    }
  },
  methods: {
    openCreateModal() {
      this.isEditing = false;
      this.supplyToEdit = null;
      this.showSupplyModal = true;
    },
    openEditModal(supply) {
      this.isEditing = true;
      this.supplyToEdit = { ...supply };
      this.showSupplyModal = true;
    },
    openAddModal() {
      this.isEditing = false;
      this.selectedInventoryItem = null;
      this.showInventoryModal = true;
    },
    openInventoryEditModal(item) {
      const matchedSupply = this.supplies.find(s => s.name === item.name);

      this.selectedInventoryItem = {
        supply: matchedSupply || null,
        stock: item.stock,
        provider: item.provider || null,
        expiry: item.expiry || null
      };

      this.isEditing = true;
      this.showInventoryModal = true;
    },
    createSupply(newItem) {
      this.supplies.push({ ...newItem });
      this.showSupplyModal = false;
    },
    updateSupply(updatedItem) {
      const index = this.supplies.findIndex(s => s.name === updatedItem.name);
      if (index !== -1) {
        this.supplies[index] = { ...updatedItem };
      }
      this.showSupplyModal = false;
    },
    handleInventoryUpdate(updatedItem) {
      const index = this.inventory.findIndex(i => i.name === updatedItem.name);
      if (index !== -1) {
        this.inventory[index] = { ...updatedItem };
      }
      this.showInventoryModal = false;
    }
  }

}

</script>

<template>
  <div class="p-4">
    <div class="flex flex-column gap-4">
      <div class="surface-card shadow-2 p-4 border-round" style="flex: 0 0 30%;">
        <div class="flex justify-content-around align-items-center mb-4">
          <h1>Insumos</h1>
          <pv-button label="Crear" icon="pi pi-plus" @click="openCreateModal" />

        </div>

        <div v-if="supplies.length === 0" class="text-center">
          <p>Aún no has agregado insumos. Añádelos para comenzar a gestionar tu inventario.</p>
          <pv-button label="Crear Insumo" icon="pi pi-plus" class="mt-2" @click="openCreateModal" />
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
        <div class="flex justify-content-around align-items-center mb-4">
          <h1 class="m-0">Inventory</h1>
          <div class="flex align-items-center gap-2">
            <pv-input-text v-model="search" placeholder="Buscar..." />
            <pv-button label="Añadir" icon="pi pi-plus" @click="openAddModal"/>

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
            <template #body="slotProps">
              <pv-button
                  icon="pi pi-pencil"
                  text
                  @click="() => {openInventoryEditModal(slotProps.data) }"
              />
              <pv-button icon="pi pi-trash" text severity="danger" />
            </template>
          </pv-column>
        </pv-data-table>
      </div>
    </div>


    <inventory-supply-create-and-edit
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
    <inventorySupplyAddAndEdit
        :visible="showInventoryModal"
        :isEdit="isEditing"
        :itemToEdit="selectedInventoryItem"
        :supplies="supplies"
        :providers="providers"
        :isPerishable="selectedInventoryItem?.perishable === 'Sí'"
        @update:visible="showInventoryModal = $event"
        @update="handleInventoryUpdate"
        @cancel="showInventoryModal = false"
    />
  </div>
</template>
