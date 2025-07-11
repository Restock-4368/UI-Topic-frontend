<script>
export default {
  name: "filters-section",
  props: {
    title: {
      type: String,
      default: 'Orders'
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selectedDateRange: {
      type: String,
      default: ''
    },
    searchPlaceholder: {
      type: String,
      default: 'Search...'
    },
    sortOrder: {
      type: Number,
      default: 1
    },
    sortLabel: {
      type: String,
      default: 'Order Date'
    }
  },
  emits: ['update:searchQuery', 'update:selectedDateRange', 'toggle-sort'],
  computed: {
    dateRanges() {
      return [
        { value: '7days', label: this.$t('supplier-orders.filters.last-7days') },
        { value: '30days', label: this.$t('supplier-orders.filters.last-30days') },
        { value: '3months', label: this.$t('supplier-orders.filters.last-3months') },
      ]
    }
  }
}
</script>

<template>
  <div class="filters-section">
    <div class="filters-left">
      <h3 class="orders-title">{{ title }}</h3>

      <!-- Search container -->
      <div class="search-container">
        <i class="pi pi-search search-icon"></i>
        <pv-input-text
            :value="searchQuery"
            @update:modelValue="$emit('update:searchQuery', $event)"
            :placeholder="$t('supplier-orders.filters.search-placeholder')"
            class="search-input"
        />
      </div>

      <!-- Slot to personalize filters -->
      <slot name="filters"></slot>

      <div class="range-date-container">
        <!-- Date Range -->
        <pv-dropdown
            :value="selectedDateRange"
            @update:modelValue="$emit('update:selectedDateRange', $event)"
            :options="dateRanges"
            option-label="label"
            option-value="value"
            :placeholder="$t('supplier-orders.filters.date-range-placeholder')"
            class="filter-dropdown"
            :show-clear="true"
        />
      </div>

      <!-- Sort button -->
      <button
          @click="$emit('toggle-sort')"
          class="sort-button"
      >
        {{ $t('supplier-orders.filters.order-date-button') }}
        <i :class="['pi', sortOrder === 1 ? 'pi-sort-up' : 'pi-sort-down']"></i>
      </button>

    </div>

    <!-- Slot to buttons of right side -->
    <div class="filters-right">
      <slot name="actions"></slot>
    </div>
  </div>



</template>

<style scoped>

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  gap: 1rem;
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters-right {
  display: flex;
  align-items: center;
}

.orders-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #6b7280;
  z-index: 10;
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem !important;
  min-width: 260px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    justify-content: center;
  }

  .filters-right {
    justify-content: center;
  }

  .search-input {
    min-width: 200px;
  }
}
</style>