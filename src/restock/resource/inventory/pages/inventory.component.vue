<script>
import inventorySupplyCreateAndEdit from '../components/inventory-supply-create-and-edit.component.vue';
import inventorySupplyAddAndEdit from '../components/inventory-supply-add-and-edit.component.vue';
import InventorySupplyCard from '../components/inventory-supply-card.component.vue';
import { SupplyCategoryService } from '../services/supply-category.service.js';
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
    isMobileView() {
      return this.windowWidth <= 640;
    },
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
      windowWidth: window.innerWidth
    }

  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.loadCategories();
    this.loadUnits();
    this.loadSupplies();
    this.loadBatchesWithSupply();

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    async updateBatch(updatedItem) {
      try {
        const id = this.selectedInventoryItem.id;
        const formattedPayload = {
          supply_id: updatedItem.supply_id,
          stock: updatedItem.stock,
          expiration_date: updatedItem.expiration_date,
          user_id: 2, // Assuming user_id is required, replace with actual user ID logic
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
          price: newItem.price,
          // Assuming user_id is required, replace with actual user ID logic
          user_id: 2
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
          price: updatedItem.price,
          user_id: 2 // Assuming user_id is required, replace with actual user ID logic
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
          user_id: 2 // Assuming user_id is required, replace with actual user ID logic
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
        <div class="flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <h1 class="m-0 w-full sm:w-auto text-lg font-semibold">
            {{ $t('inventory.supplies-catalog-title') }}
          </h1>

          <pv-button :label="$t('inventory.create-button')" icon="pi pi-plus-circle" @click="openCreateModal"
            class="green-button w-full sm:w-auto" />
        </div>

        <div v-if="supplies.length === 0"
          class="flex flex-column align-items-center justify-content-center text-center gap-2 p-3">
          <p class="text-sm sm:text-base font-light m-0">
            {{ $t('inventory.supplies-catalog-create-and-edit-modal.not-supplies') }}
          </p>
          <pv-button :label="$t('inventory.create-button')" icon="pi pi-plus-circle"
            class="green-button w-full sm:w-auto" @click="openCreateModal" />
        </div>
        <div v-else>
          <pv-carousel :value="supplies" :numVisible="3" :numScroll="1" :showIndicators="isMobileView"
            :showNavigators="!isMobileView" :responsiveOptions="[
              { breakpoint: '960px', numVisible: 2, numScroll: 1 },
              { breakpoint: '640px', numVisible: 1, numScroll: 1 }
            ]">
            <template #item="slotProps">
              <inventory-supply-card :supply="slotProps.data" @edit="openEditModal" />
            </template>
          </pv-carousel>
        </div>
      </div>

      <div class="surface-card p-4 border-round-3xl">
        <div class="flex flex-wrap gap-3 justify-between align-items-center mb-4">

          <h1 class="m-0 w-full lg:w-auto text-lg font-semibold">
            {{ $t('inventory.supplies-inventory-title') }}
          </h1>

          <pv-input-text v-model="search" :placeholder="$t('inventory.supplies-inventory-placeholder')"
            class="font-light w-full sm:w-10 md:w-8 lg:w-5" />

          <pv-button :label="$t('inventory.add-button')" icon="pi pi-plus-circle" @click="openAddModal"
            class="green-button w-full sm:w-auto" />

          <div class="flex align-items-center gap-2 w-full sm:w-auto justify-content-center sm:justify-content-end">
            <span class="text-sm">{{ paginationStart }}-{{ paginationEnd }} de {{ filteredInventory.length }}</span>
            <pv-button icon="pi pi-angle-left" text :disabled="currentPage === 1" @click="currentPage--" />
            <pv-button icon="pi pi-angle-right" text :disabled="currentPage >= totalPages" @click="currentPage++" />
          </div>
        </div>
        <div style="overflow-x: auto; background: white; border-radius: 8px; padding: 16px; max-height: 400px;">
          <pv-data-table :value="paginatedInventory" :rowClass="(data) => getExpirationRowClass(data)" scrollable
            scrollHeight="300px" responsiveLayout="scroll" style="min-width: 900px; font-size: 14px;">

            <pv-column field="name" :header="$t('inventory.table.supply')" />
            <pv-column field="category" :header="$t('inventory.table.category')" />
            <pv-column field="unit" :header="$t('inventory.table.unit')" />
            <pv-column field="expiration_date" :header="$t('inventory.table.expiration-date')" />
            <pv-column field="stock" :header="$t('inventory.table.stock')" />

            <pv-column v-if="role === 'admin'" field="min_stock" :header="$t('inventory.table.minimum-stock')" />
            <pv-column v-if="role === 'admin'" field="max_stock" :header="$t('inventory.table.maximum-stock')" />

            <pv-column field="perishable" :header="$t('inventory.table.pereshible')" />
            <pv-column :header="$t('inventory.table.actions')" style="min-width: 120px;">
              <template #body="slotProps">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <pv-button icon="pi pi-pen-to-square" text style="color: #16a34a;"
                    @click="() => openInventoryEditModal(slotProps.data)" />
                  <pv-button icon="pi pi-trash" text severity="danger" style="color: #dc2626;"
                    @click="() => confirmDelete(slotProps.data)" />
                </div>
              </template>
            </pv-column>

          </pv-data-table>
        </div>

      </div>
    </div>

    <pv-dialog :visible="showDeleteModal" modal :header="$t('inventory.supplies-inventory-delete-modal.title')"
      style="width: 450px" @update:visible="showDeleteModal = $event">
      <div class="p-1">
        <p class="font-light" style="white-space: pre-line;">
          {{ $t('inventory.supplies-inventory-delete-modal.delete-message', {
            name: itemToDelete?.name,
            quantity: `${itemToDelete?.stock} ${itemToDelete?.unit}`
          }) }}
        </p>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <pv-button :label="$t('inventory.supplies-inventory-delete-modal.cancel-button')" severity="danger"
            @click="showDeleteModal = false" class="red-button" />
          <pv-button :label="$t('inventory.supplies-inventory-delete-modal.confirm-button')" severity="success"
            @click="deleteBatch" class="green-button" />
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
