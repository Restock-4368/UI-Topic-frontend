<script>
import inventorySupplyCreateAndEdit from './inventory-supply-create-and-edit.component.vue';
import inventorySupplyAddAndEdit from './inventory-supply-add-and-edit.component.vue';
import InventorySupplyCard from './inventory-supply-card.component.vue';
export default {
  name: 'InventoryComponent',
  components: {
    inventorySupplyCreateAndEdit,
    inventorySupplyAddAndEdit,
    InventorySupplyCard
  },
  computed: {
    filteredInventory() {
      if (!this.search.trim()) return this.inventory;
      const term = this.search.toLowerCase();
      return this.inventory.filter(item => item.name.toLowerCase().includes(term));
    }
  },
  data() {
    return {
      showSupplyModal: false,
      search: '',
      showInventoryModal: false,
      selectedInventoryItem: null,
      isEditing: false,
      supplyToEdit: null,
      itemToDelete: null,
      showDeleteModal: false,
      newSupply: {
        name: '',
        category: null,
        unit: null,
        description: ''
      },
      categories: ['Verduras', 'Carnes', 'Granos', 'Lácteos', 'Bebidas'],
      units: ['kg', 'l', 'unidades', 'g', 'ml'],
      supplies: [
        { name: 'Tomate', category: 'Verduras', unit: 'kg', description: 'Tomate fresco, orgánico, ideal para ensaladas y salsas.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Pollo', category: 'Carnes', unit: 'kg', description: 'Pechuga de pollo sin piel, rica en proteínas, lista para cocinar.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Leche', category: 'Lácteos', unit: 'l', description: 'Leche entera pasteurizada, ideal para consumo diario o recetas.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Papa', category: 'Verduras', unit: 'kg', description: 'Papa blanca andina, firme y versátil para todo tipo de platos.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Carne molida', category: 'Carnes', unit: 'kg', description: 'Carne de res molida fresca, perfecta para hamburguesas y guisos.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Agua mineral', category: 'Bebidas', unit: 'l', description: 'Agua mineral sin gas, purificada, embotellada en origen natural.', min: 10, max: 50, perishable: 'No' },
        { name: 'Yogurt', category: 'Lácteos', unit: 'l', description: 'Yogurt natural sin azúcar, con cultivos vivos, fuente de probióticos.', min: 10, max: 50, perishable: 'No' },
        { name: 'Zanahoria', category: 'Verduras', unit: 'kg', description: 'Zanahoria fresca, crocante y dulce, rica en betacarotenos.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Lentejas', category: 'Granos', unit: 'kg', description: 'Lentejas secas seleccionadas, ideales para guisos y ensaladas.', min: 10, max: 50, perishable: 'Sí' },
        { name: 'Cebolla', category: 'Verduras', unit: 'kg', description: 'Cebolla roja fresca, de sabor intenso, ideal para sofritos y ensaladas.', min: 10, max: 50, perishable: 'Sí' }
      ],
      inventory: [
        { name: 'Tomate', category: 'Verduras', unit: 'kg', expiry: '2025-06-01', stock: 20, min: 10, max: 50, perishable: 'Sí' },
        { name: 'Pollo', category: 'Carnes', unit: 'kg', expiry: '2025-05-10', stock: 15, min: 5, max: 30, perishable: 'Sí' },
        { name: 'Leche', category: 'Lácteos', unit: 'l', expiry: '2025-05-18', stock: 25, min: 10, max: 40, perishable: 'Sí' },
        { name: 'Papa', category: 'Verduras', unit: 'kg', expiry: '2025-06-10', stock: 30, min: 15, max: 60, perishable: 'Sí' },
        { name: 'Carne molida', category: 'Carnes', unit: 'kg', expiry: '2025-05-19', stock: 10, min: 5, max: 25, perishable: 'Sí' },
        { name: 'Agua mineral', category: 'Bebidas', unit: 'l', expiry: null, stock: 50, min: 20, max: 100, perishable: 'No' },
        { name: 'Yogurt', category: 'Lácteos', unit: 'l', expiry: '2025-05-18', stock: 18, min: 8, max: 30, perishable: 'Sí' },
        { name: 'Zanahoria', category: 'Verduras', unit: 'kg', expiry: '2025-06-12', stock: 22, min: 10, max: 45, perishable: 'Sí' },
        { name: 'Lentejas', category: 'Granos', unit: 'kg', expiry: null, stock: 40, min: 20, max: 60, perishable: 'No' },
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
    confirmDelete(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },
    deleteInventoryItem() {
      this.inventory = this.inventory.filter(i => i.name !== this.itemToDelete.name);
      this.showDeleteModal = false;
      this.itemToDelete = null;
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
    },
    handleCreateSupply(newInventoryItem){
      this.inventory.push(newInventoryItem);
      this.showInventoryModal = false;
    },
    getRowClass(data) {
      if (!data.expiry) {
        return '';
      }

      const today = new Date();
      const expiryDate = new Date(data.expiry);

      if (expiryDate < today) {
        return 'expired-row';
      }

      return '';
    }
  }

}

</script>

<template>
  <div class="px-4" >
    <div class="flex flex-column gap-4">
      <div class="surface-card shadow-4 p-4 border-round-3xl" style="flex: 0 0 30%;">
        <div class="flex justify-content-between align-items-center mb-4">
          <h1>Supplies</h1>
          <pv-button label="CREAR" icon="pi pi-plus-circle" @click="openCreateModal" class="green-button" />

        </div>

        <div v-if="supplies.length === 0" class="text-center">
          <p>Aún no has agregado insumos. Añádelos para comenzar a gestionar tu inventario.</p>
          <pv-button label="CREAR INSUMO" icon="pi pi-plus-circle" class="mt-2" @click="openCreateModal" />
        </div>

        <div v-else>
          <pv-carousel :value="supplies" :numVisible="3" :numScroll="1" :showIndicators="false">
            <template #item="slotProps">
              <inventory-supply-card
                  :supply="slotProps.data"
                  @edit="openEditModal"
              />
            </template>
          </pv-carousel>
        </div>
      </div>

      <div class="surface-card shadow-2 p-4 border-round" style="flex: 0 0 70%;">
        <div class="flex justify-content-around align-items-center mb-4">
          <h1 class="m-0">Inventory</h1>

            <pv-input-text v-model="search" placeholder="Buscar insumo" style="width: 400px" class="font-light"/>
            <pv-button label="AÑADIR" icon="pi pi-plus-circle" @click="openAddModal" class="green-button"/>


          <div class="flex align-items-center gap-2">
            <span>1-5 de 10</span>
            <pv-button icon="pi pi-angle-left" text />
            <pv-button icon="pi pi-angle-right" text />
          </div>
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
          <pv-data-table
              :value="filteredInventory"
              responsiveLayout="scroll"
              :rowClass="(data) => getRowClass(data)"
              class="overflow-x-auto"
          >
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
                    icon="pi pi-pen-to-square"
                    text
                    @click="() => {openInventoryEditModal(slotProps.data) }"
                />
                <pv-button
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    @click="() => confirmDelete(slotProps.data)"
                />
              </template>
            </pv-column>
          </pv-data-table>
        </div>

      </div>
    </div>

    <pv-dialog
        :visible="showDeleteModal"
        modal
        header="Eliminar insumo del inventario"
        style="width: 450px"
        @update:visible="showDeleteModal = $event"
    >
      <div class="p-1">
        <p class="font-light">
          Está a punto de eliminar el insumo
          <strong>“{{ itemToDelete?.name }}”</strong> con
          <strong>{{ itemToDelete?.stock }} {{ itemToDelete?.unit }}</strong>
          en el inventario de forma permanente. <br />
          Esta acción es irreversible y no podrá recuperarse luego.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <pv-button
              label="CONFIRMAR"
              severity="success"
              @click="deleteInventoryItem"
              class="green-button"
          />
          <pv-button
              label="CANCELAR"
              severity="danger"
              @click="showDeleteModal = false"
              class="red-button"
          />
        </div>
      </template>
    </pv-dialog>

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
        @create="handleCreateSupply"
        @update:visible="showInventoryModal = $event"
        @update="handleInventoryUpdate"
        @cancel="showInventoryModal = false"
    />
  </div>
</template>

<style>
h1 {
  font-weight: 400; /* Regular */
  font-size: 23px;
}

.expired-row {
  background-color: rgba(244, 21, 21, 0.3) !important;
}
</style>