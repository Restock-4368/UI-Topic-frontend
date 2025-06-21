
<script>
import { RecipeService } from '../../../planning/services/recipe.service';
import { SupplyService } from '../../../resource/inventory/services/supply.service';

export default {
  name: 'register-sales',
  props: [],
  data() {
    return {
      selectedDishId: '',
      selectedAdditionalSupplyId: '',
      selectedDishes: [],
      selectedAdditionalSupplies: [],
      availableDishes: [],
      availableAdditionalSupplies: []
    }
  },
  methods: {
    closeComponent() {
      this.$emit('close')
    },
    agregarPlato() {
      const id = this.selectedDishId;
      const dish = this.availableDishes.find(d => d.id === id);
      const current = this.selectedDishes;

      if (dish && !current.find(p => p.id === id)) {
        current.push({ ...dish, quantity: 1 });
        this.selectedDishes = [...current];
      }
    },
    agregarInsumo() {
        const id = this.selectedAdditionalSupplyId;
        const supply = this.availableAdditionalSupplies.find(i => i.id === id);
        const current = this.selectedAdditionalSupplies;

        if (supply && !current.find(i => i.id === id)) {
        current.push({ ...supply, quantity: 1 });
        this.selectedAdditionalSupplies = [...current]; // Triggers table update
        }
    },
    deleteDish(id) {
      console.log(id);
      this.selectedDishes = this.selectedDishes.filter(p => p.id !== id);
      console.log("selectedDishes: ", this.selectedDishes);
    },
    deleteAdditionalSupply(id) {
      this.selectedAdditionalSupplies = this.selectedAdditionalSupplies.filter(p => p.id !== id);
         console.log("selectedAdditionalSupplies: ", this.selectedAdditionalSupplies);
    },
    registerSale() {
       const dishes = this.selectedDishes || [];
       const supplies = this.selectedAdditionalSupplies || [];

        if (dishes.length === 0 && supplies.length === 0) {
        alert('Please select at least one dish or supply before registering the sale.');
        return;
        }
        this.$emit('register-sale', {
            dishes: dishes,
            additionalSupplies: supplies
        });
    },
    async getAllRecipes() {
      try {
        const response = await this.recipeService.getAll();
        this.availableDishes = response.data || []; // .data si es una API REST típica
      } catch (error) {
        console.error("Error al obtener recetas:", error);
      }
    },
    async getAllAdditionalSupplies() {
      try {
        const response = await this.supplyService.getAll();
        this.availableAdditionalSupplies = response.data || [];
      } catch (error) {
        console.error("Error al obtener insumos adicionales:", error);
      }
    }
  },
  created() {
    this.recipeService = new RecipeService();
    this.supplyService = new SupplyService();
    this.getAllRecipes();
    this.getAllAdditionalSupplies();
  }
}
</script>



<template>
  <div class="modal-overlay" @click="closeComponent">
    <div class="modal-content modal-scrollable" @click.stop>
      <!-- Close button -->
      <button class="close-button" @click="closeComponent">
        ✕
      </button>

      <h2 class="title">{{ $t('sales_restaurant.register_sale_modal.title') }}</h2>

      <div class="content">
        <p class="sub-text">
          {{ $t('sales_restaurant.register_sale_modal.sub-title') }}
        </p>

        <!-- Dish selection -->
        <p>{{ $t('sales_restaurant.register_sale_modal.dishes') }}</p>
        <select class="full-width" v-model="selectedDishId" @change="agregarPlato">
          <option disabled value="">{{ $t('sales_restaurant.register_sale_modal.select_dish') }}</option>
          <option v-for="dish in availableDishes" :key="dish.id" :value="dish.id">
            {{ dish.name }}
          </option>
        </select>

        <!-- Additional supply selection -->
        <p>{{ $t('sales_restaurant.register_sale_modal.additionalSuppllies') }}</p>
        <select class="full-width"  v-model="selectedAdditionalSupplyId" @change="agregarInsumo">
          <option disabled value="">{{ $t('sales_restaurant.register_sale_modal.select_additionalSupply') }}</option>
          <option v-for="supply in availableAdditionalSupplies" :key="supply.id" :value="supply.id">
            {{ supply.name }}
          </option>
        </select>

        <!-- Selected dishes table -->
        <div v-if="selectedDishes.length > 0">
          <h3>{{ $t('sales_restaurant.register_sale_modal.selected_dishes') }}</h3>
          <table class="custom-table">
            <thead>
              <tr>
                <th>{{ $t('sales_restaurant.register_sale_modal.name') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.unit_price') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.quantity') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dish, index) in selectedDishes" :key="index">
                <td>{{ dish.name }}</td>
                <td>S/ {{ dish.total_price }}</td>
                <td>
                  <input type="number" v-model.number="dish.quantity" min="1" />
                </td>
                <td>
                    <i class="pi pi-trash actions" @click="deleteDish(dish.id)"></i>
                </td>            
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Selected additional supplies table -->
        <div v-if="selectedAdditionalSupplies.length > 0">
          <h3 class="margin-top">{{ $t('sales_restaurant.register_sale_modal.selected_additionalSupplies') }}</h3>
          <table class="custom-table">
            <thead>
              <tr>
                <th>{{ $t('sales_restaurant.register_sale_modal.name') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.unit_price') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.quantity') }}</th>
                <th>{{ $t('sales_restaurant.register_sale_modal.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(supply, index) in selectedAdditionalSupplies" :key="index">
                <td>{{ supply.name }}</td>
                <td>S/ {{ supply.price }}</td>
                <td>
                  <input type="number" v-model.number="supply.quantity" min="1" />
                </td>
                <td>
                    <i class="pi pi-trash actions" @click="deleteAdditionalSupply(supply.id)"></i>
                </td> 
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Message when nothing selected -->
        <div class="no-dishes-additonalsupplies-selected"
          v-if="selectedDishes.length === 0 && selectedAdditionalSupplies.length === 0">
          {{ $t('sales_restaurant.register_sale_modal.nothing-selected') }}
        </div>
      </div>

      <div class="buttons">
        <button class="button-cancel" @click="closeComponent">
          {{ $t('sales_restaurant.register_sale_modal.cancel') }}
        </button>
        <button v-if="selectedDishes.length || selectedAdditionalSupplies.length" class="button-register" @click="registerSale">
          {{ $t('sales_restaurant.register_sale_modal.register') }}
        </button>
      </div>
    </div>
  </div>
</template>


<style>
  .margin-top {
    margin-top: 3rem;
  } 
    /* register-sales.component.css */
    .custom-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .custom-table th,
    .custom-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #ddd;
        text-align: left;
    }

    .custom-table input[type="number"] {
        width: 70px;
        padding: 6px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .actions {
        cursor: pointer;
        font-size: 18px;
        transition: transform 0.1s ease, color 0.2s;
    }

    .actions:hover {
        color: #c9302c;
        transform: scale(1.1);
    }

    .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.6);
            /* fondo oscuro opaco */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
    }

    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        min-height: 80vh;
        max-height: 80vh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }


    .close-button {
        position: absolute;
        background-color: #ffffff;
        top: 20px;
        right: 23px;
        z-index: 2;
    }

    .title {
        padding-top: 24px;
    }

    .sub-text {
        font-family: Inter;
        font-weight: 400;
        font-size: 15px;
        color: #808D99;
        margin-bottom: 2rem;
    }

    .no-dishes-additonalsupplies-selected {
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
        padding-left: 8rem;
        padding-right: 8rem;
        text-align: center;
        font-family: Poppins;
        font-size: 20px;
        font-weight: 400;
        color: #808D99;
    }

    .modal-scrollable {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        padding-top: 18px;
        box-sizing: border-box;
    }


.full-width {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  margin-bottom: 1.5rem;
}

.full-width:focus {
  outline: none;
  border-color: #4f8a5b; /* verde suave */
  box-shadow: 0 0 0 2px rgba(79, 138, 91, 0.2);
}

.full-width option {
  padding: 10px;
  font-size: 15px;
}


    .buttons {
        display: flex;
        justify-content: center;
        gap: 4rem;
        margin-bottom: 1rem;
        margin-top: 2rem;
    }

    .button-cancel {
        border-radius: 6px;
        background-color: #D9534F;
        color: white;
    }

    .button-register {
        border-radius: 6px;
        background-color: #4F8A5B;
        color: white;
    }

    mat-table {
        background-color: white;
    }

    .quantity {
        margin-top: 1.2rem;
    }

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mat-elevation-z2 {
        margin-bottom: 1.5rem;
    }
</style>