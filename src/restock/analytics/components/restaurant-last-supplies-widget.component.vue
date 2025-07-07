<script>
import { SupplyBatchService} from "../../resource/inventory/services/supply-batch.service.js";
import { SupplyService} from "../../resource/inventory/services/supply.service.js";
import { SupplyCategoryService } from "../../resource/inventory/services/supply-category.service.js";

export default {
  name: 'RestaurantLastSuppliesWidget',
  data() {
    return {
      batches: [],
    }
  },
  async mounted() {
    const batchService = new SupplyBatchService()
    const supplyService = new SupplyService()
    const categoryService = new SupplyCategoryService()

    const [batchRes, supplyRes, categoryRes] = await Promise.all([
      batchService.getAll(),
      supplyService.getAll(),
      categoryService.getAll()
    ])

    const batches = batchRes.data || []
    const supplies = supplyRes.data || []
    const categories = categoryRes.data || []

    // Creamos un mapa para acceso rápido por id
    const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]))

    this.batches = batches
        .map(b => {
          const supply = supplies.find(s => s.id === b.supply_id)
          if (!supply) return null
          return {
            ...b,
            supply: {
              ...supply,
              category: categoryMap[supply.category_id] || null
            }
          }
        })
        .filter(b => b !== null)
        .sort((a, b) => {
          const aDate = a.created_at || a.id || 0
          const bDate = b.created_at || b.id || 0
          return bDate - aDate
        })
        .slice(0, 10)
  },
  methods: {
    getPairs() {
      const pairs = []
      for (let i = 0; i < this.batches.length; i += 2) {
        pairs.push(this.batches.slice(i, i + 2))
      }
      return pairs
    },
    scrollLeft() {
      this.$refs.carousel.scrollBy({ left: -220, behavior: 'smooth' })
    },
    scrollRight() {
      this.$refs.carousel.scrollBy({ left: 220, behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <div class="last-supplies-wrapper">
    <h3 class="widget-title">Last added supplies</h3>

    <div class="carousel-wrapper">
      <button class="nav-button left" @click="scrollLeft">
        <i class="pi pi-chevron-left" />
      </button>

      <div ref="carousel" class="carousel-container">
        <div class="supply-card" v-for="(b, i) in batches" :key="i">
          <h4>{{ b.supply?.name }}</h4>
          <p class="category">{{ b.supply?.category?.name || 'Uncategorized' }}</p>
          <p class="description">{{ b.supply?.description || '-' }}</p>
        </div>
      </div>

      <button class="nav-button right" @click="scrollRight">
        <i class="pi pi-chevron-right" />
      </button>
    </div>

    <div class="supplies-grid">
      <div class="ingredient-pair" v-for="(pair, i) in getPairs()" :key="i">
        <div class="ingredient-card" v-for="(b, j) in pair" :key="j">
          <h4>{{ b.supply?.name }}</h4>
          <p class="category">{{ b.supply?.category?.name || 'Uncategorized' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-title {
  font-family: Poppins, sans-serif;
  font-weight: 500;
  font-size: 22px;
  margin-bottom: 15px;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1rem;
  padding: 1rem 2.5rem;
  scrollbar-width: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.supply-card {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 1rem;
  width: 220px;
  height: 160px;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.supply-card h4 {
  font-weight: 600;
  font-size: 15px;
  margin: 0;
}

.supply-card .category {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

.supply-card .description {
  font-size: 13px;
  color: #444;
}

.nav-button {
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.nav-button.left {
  left: 0;
}

.nav-button.right {
  right: 0;
}

/* Mobile view */
.supplies-grid {
  display: none;
}

@media (max-width: 800px) {
  .carousel-wrapper {
    display: none;
  }

  .supplies-grid {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    background: #fff;
    padding: 20px 30px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
    border-radius: 30px;
    height: 200px;
  }

  .ingredient-pair {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ingredient-card {
    background-color: #f4f4f4;
    border-radius: 15px;
    width: 215px;
    padding: 0 0 0 15px;
    min-height: 60px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    align-content: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .ingredient-card h4 {
    font-weight: bold;
    margin-bottom: 0;
  }

  .ingredient-card .category {
    font-size: 13px;
    color: #757575;
    margin-top: 2px;
  }
}
</style>