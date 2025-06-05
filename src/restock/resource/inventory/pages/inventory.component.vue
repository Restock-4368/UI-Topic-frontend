<script>
import inventorySupplyCreateAndEdit from '../components/inventory-supply-create-and-edit.component.vue';
import inventorySupplyAddAndEdit from '../components/inventory-supply-add-and-edit.component.vue';
import InventorySupplyCard from '../components/inventory-supply-card.component.vue';
import { SupplyCategoryService } from '../services/category.service';
import { SupplyCategory } from '../model/supply-category.entity';
import { UnitMeasurement } from '../model/unit-measurement.entity';
import { UnitMeasurementService } from '../services/unit-measurement.service';
import { Supply } from '../model/supply.entity';
import { SupplyService } from '../services/supply.service';
import { SupplyBatch } from '../model/supply-batch.entity';
import { SupplyBatchService } from '../services/supply-batch.service';
import { SupplyAssembler } from '../services/supply.assembler';
import { UnitMeasurementAssembler } from '../services/unit-measurement.assembler';
import { SupplyCategoryAssembler } from '../services/supply-category.assembler';
import { SupplyBatchAssembler } from '../services/supply-batch.assembler';

export default {

  name: 'InventoryComponent',
  components: {
    inventorySupplyCreateAndEdit,
    inventorySupplyAddAndEdit,
    InventorySupplyCard
  },
  computed: {
    filteredInventory() {
      if (!this.search.trim()) return this.batches;
      const term = this.search.toLowerCase();
      return this.batches.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    },
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.filteredInventory.length);
    },
    totalPages() {
      return Math.ceil(this.filteredInventory.length / this.itemsPerPage);
    },
    paginatedInventory() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredInventory.slice(start, end);
    },
  },
  data() {
    return {
      role: 'admin',
      showSupplyModal: false,
      search: '',
      showInventoryModal: false,
      selectedInventoryItem: null,
      isEditing: false,
      supplyToEdit: null,
      itemToDelete: null,
      showDeleteModal: false,
      categories: [],
      category: new SupplyCategory(),
      categoryService: new SupplyCategoryService(),
      units: [],
      unitMeasurement: new UnitMeasurement(),
      UnitMeasurementService: new UnitMeasurementService(),
      supplies: [],
      supplyBatchService: new SupplyBatchService(),
      supplyService: new SupplyService(),
      batches: [],
      providers: ['Proveedor A', 'Proveedor B', 'Proveedor C'],
      currentPage: 1,
      itemsPerPage: 5,
    }

  },
  mounted() {
    this.loadCategories();
    this.loadUnits();
    this.loadSupplies();
    this.loadBatchesWithSupply();
  },
  methods: {
    async updateBatch(updatedItem) {
      try {
        const id = this.selectedInventoryItem.id;
        const formattedPayload = {
          supply_id: updatedItem.supply_id,
          stock: updatedItem.stock,
          expiration_date: updatedItem.expiration_date
        };

        await this.supplyBatchService.update(id, formattedPayload);

        await this.loadBatchesWithSupply();
        this.showInventoryModal = false;
      } catch (error) {
        console.error('Error al actualizar batch de insumo:', error);
      }
    },
    async deleteBatch() {
      try {
        await this.supplyBatchService.delete(this.itemToDelete.id);
        await this.loadBatchesWithSupply();
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } catch (error) {
        console.error('Error al eliminar el batch:', error);
      }
    },
    async createSupply(newItem) {
      try {
        const payload = {
          name: newItem.name,
          description: newItem.description,
          perishable: newItem.perishable,
          category_id: newItem.category_id,
          unit_measurement_id: newItem.unit_measurement_id,
          min_stock: newItem.min_stock ?? null,
          max_stock: newItem.max_stock ?? null,
          price: newItem.price
        };

        await this.supplyService.create(payload);

        await this.loadSupplies();

        this.showSupplyModal = false;
      } catch (error) {
        console.error('Error al crear el insumo:', error);
      }
    },
    async updateSupply(updatedItem) {
      try {
        const id = this.supplyToEdit.id;

        const formattedPayload = {
          name: updatedItem.name,
          description: updatedItem.description,
          perishable: updatedItem.perishable,
          category_id: updatedItem.category_id,
          unit_measurement_id: updatedItem.unit_measurement_id,
          min_stock: updatedItem.min_stock ?? null,
          max_stock: updatedItem.max_stock ?? null,
          price: updatedItem.price
        };

        await this.supplyService.update(id, formattedPayload);

        await this.loadSupplies();

        this.showSupplyModal = false;
      } catch (error) {
        console.error('Error al actualizar insumo:', error);
      }
    },
    async createBatch(batchData) {
      try {
        const payload = {
          supply_id: batchData.supply_id,
          stock: batchData.stock,
          expiration_date: batchData.expiration_date !== undefined ? batchData.expiration_date : null,
          provider: batchData.provider || null
        };
        await this.supplyBatchService.create(payload);
        await this.loadBatchesWithSupply();
        this.showInventoryModal = false;
      } catch (error) {
        console.error('Error al crear el batch:', error);
      }
    }
    ,
    async loadBatchesWithSupply() {
      try {
        const response = await this.supplyBatchService.getAll();
        const rawBatches = response.data;
        const enrichedBatches = [];

        for (const b of rawBatches) {
          const batch = new SupplyBatch(b);
          try {
            const supplyResponse = await this.supplyService.getById(batch.supply_id);
            const supply = new Supply(supplyResponse.data);

            const categoryResponse = await this.categoryService.getById(supply.category_id);
            supply.category = categoryResponse.data.name;

            const unitResponse = await this.UnitMeasurementService.getById(supply.unit_measurement_id);
            supply.unit = unitResponse.data.name;

            enrichedBatches.push({
              ...supply,
              ...batch,
              category: supply.category,
              unit: supply.unit
            });

          } catch (error) {
            console.error(`Error al cargar supply/categoría/unidad para batch id ${batch.id}`, error);
            enrichedBatches.push(batch);
          }
        }
        this.batches = enrichedBatches;
      } catch (error) {
        console.error('Error al cargar los batches:', error);
      }
    },
    async loadSupplies() {
      try {
        const response = await this.supplyService.getAll();
        const supplies = SupplyAssembler.toEntitiesFromResponse(response);

        const enrichedSupplies = [];

        for (const supply of supplies) {
          try {
            const [categoryResponse, unitResponse] = await Promise.all([
              this.categoryService.getById(supply.category_id),
              this.UnitMeasurementService.getById(supply.unit_measurement_id)
            ]);

            supply.category = categoryResponse.data.name;
            supply.unit = unitResponse.data.name;

          } catch (error) {
            console.error(`Error obteniendo detalles de supply con ID ${supply.id}`, error);
          }

          enrichedSupplies.push(supply);
        }

        this.supplies = enrichedSupplies;
        console.log("Estos son los supplies:", this.supplies);
      } catch (error) {
        console.error('Error al cargar los supplies:', error);
      }
    },
    async loadCategories() {
      try {
        const response = await this.categoryService.getAll();
        this.categories = SupplyCategoryAssembler.toEntitiesFromResponse(response);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    },
    async loadUnits() {
      this.UnitMeasurementService.getAll()
        .then(response => {
          this.units = UnitMeasurementAssembler.toEntitiesFromResponse(response);
        })
        .catch(error => {
          console.error("Error al cargar las unidades de medida:", error);
        });
    },
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
      const matchedSupply = this.supplies.find(s => s.id === item.supply_id);

      this.selectedInventoryItem = {
        id: item.id,
        supply: matchedSupply || null,
        stock: item.stock,
        provider: item.provider || null,
        expiry: item.expiration_date || null
      };

      this.isEditing = true;
      this.showInventoryModal = true;
    },
    confirmDelete(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },
    getExpirationRowClass(data) {
      return data.expiration_date && new Date(data.expiration_date) < new Date() ? 'expired-row' : '';
    }
  }

}
</script>

<template>
  <div>
    <div class="flex flex-column gap-4">

      <div class="surface-card shadow-4 p-4 border-round-3xl">
        <div class="px-3 py-1 rounded font-semibold text-white w-max"
          :class="role === 'admin' ? 'bg-green-600' : 'bg-blue-600'">
          {{ role }}
        </div>
        <div class="flex justify-content-between align-items-center mb-4">
          <h1>Supplies Catalog</h1>
          <pv-button label="CREAR" icon="pi pi-plus-circle" @click="openCreateModal" class="green-button" />

        </div>

        <div v-if="supplies.length === 0" class="text-center">
          <p>Aún no has agregado insumos. Añádelos para comenzar a gestionar tu inventario.</p>
          <pv-button label="CREAR INSUMO" icon="pi pi-plus-circle" class="mt-2" @click="openCreateModal" />
        </div>

        <div v-else>
          <pv-carousel :value="supplies" :numVisible="3" :numScroll="1" :showIndicators="false">
            <template #item="slotProps">
              <inventory-supply-card :supply="slotProps.data" @edit="openEditModal" />
            </template>
          </pv-carousel>
        </div>
      </div>

      <div class="surface-card p-4 border-round-3xl">
        <div class="flex justify-content-around align-items-center mb-4">
          <h1 class="m-0">Inventory of Supplies</h1>

          <pv-input-text v-model="search" placeholder="Buscar insumo" style="width: 400px" class="font-light" />
          <pv-button label="AÑADIR" icon="pi pi-plus-circle" @click="openAddModal" class="green-button" />
          <div class="flex align-items-center gap-2">
            <span>{{ paginationStart }}-{{ paginationEnd }} de {{ filteredInventory.length }}</span>
            <pv-button icon="pi pi-angle-left" text :disabled="currentPage === 1" @click="currentPage--" />
            <pv-button icon="pi pi-angle-right" text :disabled="currentPage >= totalPages" @click="currentPage++" />
          </div>
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
          <pv-data-table :value="paginatedInventory" responsiveLayout="scroll"
            :rowClass="(data) => getExpirationRowClass(data)" class="overflow-x-auto">
            <pv-column field="name" header="Insumos" />
            <pv-column field="category" header="Categoría" />
            <pv-column field="unit" header="Unidad de medida" />
            <pv-column field="expiration_date" header="Fecha de caducidad" />
            <pv-column field="stock" header="Stock" />
            <pv-column v-if="role === 'admin'" field="min_stock" header="Stock Mínimo" />
            <pv-column v-if="role === 'admin'" field="max_stock" header="Stock Máximo" />
            <pv-column field="perishable" header="Perecible" />
            <pv-column header="Acciones">
              <template #body="slotProps">
                <pv-button icon="pi pi-trash" text severity="danger" @click="() => confirmDelete(slotProps.data)" />
                <pv-button icon="pi pi-pen-to-square" text @click="() => { openInventoryEditModal(slotProps.data) }" />
              </template>
            </pv-column>
          </pv-data-table>
        </div>

      </div>
    </div>

    <pv-dialog :visible="showDeleteModal" modal header="Eliminar insumo del inventario" style="width: 450px"
      @update:visible="showDeleteModal = $event">
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
          <pv-button label="CANCELAR" severity="danger" @click="showDeleteModal = false" class="red-button" />
          <pv-button label="CONFIRMAR" severity="success" @click="deleteBatch" class="green-button" />
        </div>
      </template>
    </pv-dialog>

    <inventory-supply-create-and-edit :role="role" :visible="showSupplyModal" :isEdit="isEditing"
      :supplyToEdit="supplyToEdit" :categories="categories" :units="units" @create="createSupply" @update="updateSupply"
      @cancel="showSupplyModal = false" @update:visible="showSupplyModal = $event" />
    <inventorySupplyAddAndEdit :role="role" :visible="showInventoryModal" :isEdit="isEditing"
      :itemToEdit="selectedInventoryItem" :supplies="supplies" :providers="providers" @create="createBatch"
      @update:visible="showInventoryModal = $event" @update="updateBatch" @cancel="showInventoryModal = false" />
  </div>
</template>

<style>
h1 {
  font-weight: 400;
  font-size: 23px;
}

.expired-row {
  background-color: rgba(244, 21, 21, 0.3) !important;
}
</style>
