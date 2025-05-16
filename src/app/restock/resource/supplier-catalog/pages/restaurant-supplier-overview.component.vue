<script> import SupplierModal from "../components/supplier-modal.component.vue";

export default {
  name: 'RestaurantSupplierOverview',
  components: {SupplierModal},
  data() {
    return {
      searchText: '',
      selectedCategory: '',
      onlyActive: false,
      showAddSupplierModal: false,
      isMobile: false,
      suppliers: [],
      categories: [],
    }
  }, computed: {
    filteredSuppliers() {
      return this.suppliers.filter(s => {
        const matchesText = s.name.toLowerCase().includes(this.searchText.toLowerCase())
        const matchesCategory = this.selectedCategory ? s.category === this.selectedCategory : true
        const matchesStatus = this.onlyActive ? s.status === true : true
        return matchesText && matchesCategory && matchesStatus
      })
    }
  }, mounted() {
    this.checkViewport()
    window.addEventListener('resize', this.checkViewport)
    this.loadSuppliers()
  }, beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport)
  }, methods: {
    checkViewport() {
      this.isMobile = window.innerWidth <= 600
    }, loadSuppliers() {
      const mock = [{
        id: 1,
        name: 'Frutas Perú SAC',
        category: 'Frutas',
        email: 'ventas@frutasperu.com',
        status: true,
        added: false
      }, {
        id: 2,
        name: 'Carnes Selectas',
        category: 'Carnes',
        email: 'contacto@carnesseleccionadas.com',
        status: true,
        added: false
      }, {
        id: 3,
        name: 'Abarrotes Lima',
        category: 'Abarrotes',
        email: 'soporte@abarroteslima.pe',
        status: false,
        added: false
      }]
      this.suppliers = mock.filter(s => s.added)
      this.categories = [...new Set(this.suppliers.map(s => s.category))]
    }, goToDetail(id) {
      this.$router.push(`/dashboard/restaurant/suppliers/${id}`)
    }
  }
} </script>
<template>
  <div class="supplier-container"> <!-- Desktop header -->
    <div class="desktop-only" v-if="!isMobile">
      <div class="supplier-header"><h2 class="text-sales">Suppliers</h2>
        <div class="supplier-filters">
          <pv-input-text v-model="searchText" placeholder="Search supplier" class="filter-input">
            <template #prepend><i class="pi pi-search"/></template>
          </pv-input-text>
          <pv-dropdown
              :options="categories"
              v-model="selectedCategory"
              placeholder="Category"
              class="filter-select"
          />

          <pv-input-switch v-model="onlyActive" :disabled="!suppliers.length"/>
          <label class="ml-2">Show only actives</label>
        </div>

        <pv-button
            label="ADD"
            icon="pi pi-plus-circle"
            class="new-supplier-btn"
            @click="showAddSupplierModal = true"
        />
      </div>
    </div>

    <!-- Mobile header -->
    <div class="mobile-only" v-else>
      <div class="top-row">
        <h2 class="text-sales">Suppliers</h2>
        <pv-button
            icon="pi pi-plus-circle"
            label="ADD"
            class="new-supplier-btn"
            @click="showAddSupplierModal = true"
        />
      </div>
      <div class="search-row">
        <pv-input-text v-model="searchText" placeholder="Search supplier" class="w-full"/>
      </div>
      <div class="category-row">
        <pv-dropdown
            :options="categories"
            v-model="selectedCategory"
            placeholder="Category"
            class="filter-select"
        />
        <pv-input-switch v-model="onlyActive" :disabled="!suppliers.length"/>
        <label class="ml-2">Show only actives</label>
      </div>
    </div>

    <!-- Table -->
    <div v-if="!filteredSuppliers.length" class="empty-state">
      <p>Currently you have no suppliers added, please add new suppliers to manage them from here.</p>
      <i class="pi pi-users supplier-icon"/>
    </div>

    <div v-else class="table-wrapper mt-4">
      <h5 class="table-title">Supplier list</h5>
      <pv-data-table :value="filteredSuppliers" responsiveLayout="scroll" class="supplier-table">
        <pv-column field="name" header="Name"/>
        <pv-column field="category" header="Category"/>
        <pv-column field="email" header="Email"/>
        <pv-column header="">
          <template #body="slotProps">
            <pv-button icon="pi pi-book" text @click="goToDetail(slotProps.data.id)"/>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
  <supplier-modal v-if="showAddSupplierModal" @close="showAddSupplierModal = false"/>
</template>

<style scoped>
.desktop-only {
  display: flex;
}
.mobile-only {
  display: none;
}
.empty-state {
  text-align: center;
  margin-top: 40px;
  color: #7f8c8d;
}

.supplier-icon {
  width: 100%;
  height: 100%;
  font-size: 160px;
  color: #7f8c8d;
}
@media (max-width: 600px) {
  .mobile-only {
    display: flex;
  }
}
</style>