<script> export default {
  name: 'RestaurantLastSuppliesWidget', data() {
    return {
      ingredients: [{
        name: 'Pescado bonito',
        category: 'Fish',
        description: 'Se requiere producto fresco, refrigerado entre 0°C y 4°C'
      }, {
        name: 'Ají amarillo',
        category: 'Vegetal',
        description: 'Usado para base de salsas. Preferencia fresco'
      }, {
        name: 'Papa Huayro',
        category: 'Vegetal',
        description: 'Usada para platos criollos. Se requiere cocción rápida'
      }, {
        name: 'Cebolla roja',
        category: 'Vegetal',
        description: 'Requiere frescura y consistencia firme'
      }, {
        name: 'Leche evaporada',
        category: 'Lácteo',
        description: 'Marca específica solicitada, se almacena en ambiente seco'
      }, {
        name: 'Queso fresco',
        category: 'Lácteo',
        description: 'Debe venir sellado al vacío y refrigerado'
      }, {name: 'Arroz', category: 'Grano', description: 'Variedad extra grano largo'}, {
        name: 'Ajo molido',
        category: 'Condimento',
        description: 'Debe venir empacado en bolsas de 1kg'
      }, {
        name: 'Culantro fresco',
        category: 'Hierba',
        description: 'Entregar en bolsas húmedas, refrigerado'
      }, {name: 'Pimiento rojo', category: 'Vegetal', description: 'Se requiere lavado y listo para picar'},]
    };
  }, methods: {
    getPairs() {
      const pairs = []
      for (let i = 0; i < this.ingredients.length; i += 2) {
        pairs.push(this.ingredients.slice(i, i + 2))
      }
      return pairs
    }, scrollLeft() {
      this.$refs.carousel.scrollBy({left: -220, behavior: 'smooth'})
    }, scrollRight() {
      this.$refs.carousel.scrollBy({left: 220, behavior: 'smooth'})
    }
  }
}
</script>
<template>

  <div class="last-supplies-wrapper"><h3 class="widget-title">Last added supplies</h3>
    <div class="last-supplies-widget">
      <!-- Desktop Carousel -->
      <div class="carousel-wrapper">
        <button class="nav-button left" @click="scrollLeft"><i class="pi pi-chevron-left"/></button>
        <div ref="carousel" class="carousel-container">
          <div class="supply-card" v-for="(i, index) in ingredients" :key="index"><h4>{{ i.name }}</h4>
            <p class="category">{{ i.category }}</p>
            <p class="description">{{ i.description }}</p></div>
        </div>
        <button class="nav-button right" @click="scrollRight"><i class="pi pi-chevron-right"/></button>
      </div>
      <!-- Mobile Scrollable Grid -->
      <div class="supplies-grid">
        <div class="ingredient-pair" v-for="(pair, i) in getPairs()" :key="i">
          <div class="ingredient-card" v-for="(i, j) in pair" :key="j">
            <h4>{{ i.name }}</h4>
            <p class="category">{{ i.category }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.last-supplies-wrapper {
  display: flex;
  flex-direction: column;
}

.widget-title {
  font-family: Poppins, sans-serif;
  font-weight: 500;
  font-size: 23px;
  color: #333;
}

/* Box con shadow */
.last-supplies-widget {
  background: #fff;
  padding: 20px 50px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}

/* Desktop carousel */
.carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 10px;
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1rem;
  scrollbar-width: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.supply-card {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 1rem;
  max-width: 200px;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.supply-card h4 {
  font-size: 16px;
  font-weight: 600;
}

.category {
  font-size: 14px;
  font-weight: 500;
  color: #757575;
}

.description {
  font-size: 13px;
  color: #444;
}

.nav-button {
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  background-color: #9E9E9E;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-button.left {
  left: -3%;
}

.nav-button.right {
  right: -3%;
}

/* Mobile Scroll Grid */
.supplies-grid {
  display: none;
}

@media (max-width: 800px) {
  .last-supplies-widget{
    padding: 20px 20px 10px 20px ;
  }

  .carousel-wrapper {
    display: none;
  }

  .supplies-grid {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    background: #fff;
    padding: 0;
    padding-bottom: 10px;
  }

  .ingredient-pair {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ingredient-card {
    background-color: #F4F4F4;
    border-radius: 15px;
    width: 215px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem;
  }

  .ingredient-card h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
  }

  .ingredient-card .category {
    font-size: 13px;
    color: #757575;
    margin: 0;
  }

  .widget-title {
    font-size: 18px;
  }
} </style>