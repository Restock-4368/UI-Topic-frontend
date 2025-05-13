<script>
export default {
  name: 'InventoryComponent',
  data() {
    return {
      showSupplyModal: false,
      search: '',
      categories: ['Verduras', 'Carnes', 'Granos', 'Lácteos', 'Bebidas'],
      units: ['kg', 'l', 'unidades', 'g', 'ml'],
      supplies: [
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
      newSupply: {
        name: '',
        category: null,
        unit: null,
        description: ''
      }
    }
  },
  methods: {
    createSupply() {
      const { name, category, unit } = this.newSupply
      if (name && category && unit) {
        this.supplies.push({ ...this.newSupply })
        this.showSupplyModal = false
        this.newSupply = {
          name: '',
          category: null,
          unit: null,
          description: ''
        }
      }
    }
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex flex-column gap-4">
      <div class="surface-card shadow-2 p-4 border-round" style="flex: 0 0 30%;">
        <div class="flex justify-between align-items-center mb-4">
          <h1>Insumos</h1>
          <pv-button label="Crear" icon="pi pi-plus" @click="showSupplyModal = true" />

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


    <pv-dialog header="Crear Insumo" v-model:visible="showSupplyModal" modal class="w-4">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre de insumo</label>
          <pv-input-text v-model="newSupply.name" />
        </div>
        <div class="field">
          <label>Categoría</label>
          <pv-dropdown v-model="newSupply.category" :options="categories" placeholder="Selecciona una categoría" />
        </div>
        <div class="field">
          <label>Unidad de medida</label>
          <pv-dropdown v-model="newSupply.unit" :options="units" placeholder="Selecciona unidad" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <pv-input-text v-model="newSupply.description" />
        </div>
        <div class="flex justify-end gap-2 mt-3">
          <pv-button label="Cancelar" text @click="showSupplyModal = false" />
          <pv-button label="Crear" icon="pi pi-check" @click="createSupply" />
        </div>
      </div>
    </pv-dialog>
  </div>
</template>
