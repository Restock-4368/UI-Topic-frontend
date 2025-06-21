<script>
import { RecipeSupplyService } from '../../../planning/services/recipe-supply.service';
import { RecipeService } from '../../../planning/services/recipe.service';
import { SupplyBatchService } from '../../../resource/inventory/services/supply-batch.service';
import { SupplyService } from '../../../resource/inventory/services/supply.service';
import { RestaurantSaleService } from '../services/restaurant-sale.service';
import { SalesAdditionalSupplyService } from '../services/sales-additional-supply.service';
import { SalesRecipeService } from '../services/sales-recipe.service';
import SaleDetailModal from './sale-detail.component.vue';


export default {
  name: 'SalesNotAddedToInventoryModal',
  components: { SaleDetailModal },
  data() {
    return {
      selectedSales: [], // Array para almacenar las ventas seleccionadas
      selectedSale: null, //para el detalle de la venta seleccionada
      showModalSaleDetail: false,
      dataSource: [], // Aquí deberías cargar los datos de las ventas no añadidas al inventario
      registered_sales_not_discounted_in_inventory: false //para saber si hay registros que mosttrar, sino mostrar mensaje
    };
  },
  computed: {
    isAllSelected() {
      return this.selectedSales.length === this.dataSource.length;
    }
  },
  methods: {
    closeComponent() {
      this.$emit('close');
    },
    isSelected(sale) {
      return this.selectedSales.includes(sale);
    },
    toggleSelection(sale, isChecked) {
      if (isChecked) {
        if (!this.selectedSales.includes(sale)) {
          this.selectedSales.push(sale);
        }
      } else {
        this.selectedSales = this.selectedSales.filter(s => s.code !== sale.code);
      }
    },
    toggleAllSelection(checked) { // marcar todo
      this.selectedSales = checked ? [...this.dataSource] : [];
    },
    async openSaleDetail(sale) {
        try {
            const saleId = sale.id;

            const [recipesRes, additionalSuppliesRes, allRecipesRes, allSuppliesRes] = await Promise.all([
            this.salesRecipeService.getByQuery("sale_id", saleId),
            this.salesAdditionalSupplyService.getByQuery("sale_id", saleId),
            this.recipeService.getAll(),
            this.supplyService.getAll()
            ]);

            const recipes = recipesRes.data;
            const additionalSupplies = additionalSuppliesRes.data;
            const allRecipes = allRecipesRes.data;
            const allSupplies = allSuppliesRes.data;

            const enrichedDishes = recipes.map(sr => {
            const recipe = allRecipes.find(r => r.id === sr.recipe_id);
            return {
                name: recipe?.name || 'Desconocido',
                unitPrice: recipe?.total_price || 0,
                quantity: sr.quantity
            };
            });

            const enrichedSupplies = additionalSupplies.map(sas => {
            const supply = allSupplies.find(s => s.id === sas.supply_id);
            return {
                name: supply?.name || 'Desconocido',
                unitPrice: supply?.price || 0,
                quantity: sas.quantity
            };
            });

            this.selectedSale = {
            ...sale,
            dishes: enrichedDishes,
            additionalSupplies: enrichedSupplies
            };

            console.log('Selected sale enriched:', this.selectedSale);
            this.showModalSaleDetail = true;
        } catch (error) {
            console.error('Error loading sale details:', error);
        }
    },
    closeSaleDetailModal() {
      this.showModalSaleDetail = false;
      this.selectedSale = null;
    },
//     async registerSalesToInventory() {
//         try {
//             // Obtener todas las ventas
//             const response = await this.restaurantSaleService.getAll();
//             const allSales = response.data;

//             // Filtrar solo las seleccionadas
//             const selectedSales = this.selectedSales; // Ya deberían estar seleccionadas antes

//             // Actualizar cada una
//             const updatePromises = selectedSales.map(sale => {
//                 const originalSale = allSales.find(s => s.id === sale.id);
//                 if (!originalSale) return Promise.resolve(); // evitar errores

//                 return this.restaurantSaleService.update(sale.id, {
//                     ...originalSale,
//                     added_inventory: true
//                 });
//             });

//             await Promise.all(updatePromises);

// //esto no funciona
//              setTimeout(() => {
//               this.$emit('refecth_sales_updated_in_inventory');
//               this.$emit('show-toast',"Succesfully discounted from inventory");
//               this.closeComponent(); // cerrar modal
//             }, 300);

//         } catch (error) {
//            console.log(error);
//         }
//     },
  async registerSalesToInventory() {
    try {
      const [
        salesRes,
        batchesRes,
        additionalSuppliesRes,
        salesRecipesRes,
        recipesRes,
        recipeSuppliesRes
      ] = await Promise.all([
        this.restaurantSaleService.getAll(),
        this.batchService.getAll(),
        this.salesAdditionalSupplyService.getAll(),
        this.salesRecipeService.getAll(),
        this.recipeService.getAll(),
        this.recipeSupplyService.getAll()
      ]);

      const allSales = salesRes.data;
      const allBatches = batchesRes.data;
      const allAdditionalSupplies = additionalSuppliesRes.data;
      const allSalesRecipes = salesRecipesRes.data;
      const allRecipes = recipesRes.data;
      const allRecipeSupplies = recipeSuppliesRes.data;

      const selectedSales = this.selectedSales;
      const supplyUsageMap = new Map(); // Map<supply_id, total_quantity>
      
      for (const sale of selectedSales) {
        // 1. Sumar supplies por recetas
        const recipesInSale = allSalesRecipes.filter(r => r.sale_id === sale.id);
        for (const sr of recipesInSale) {
          const recipeSupplies = allRecipeSupplies.filter(rs => rs.recipe_id === sr.recipe_id);
          for (const rs of recipeSupplies) {
            const currentQty = supplyUsageMap.get(rs.supply_id) || 0;
            supplyUsageMap.set(rs.supply_id, currentQty + (rs.quantity * sr.quantity));
          }
        }

        // 2. Sumar supplies adicionales
        const additionalInSale = allAdditionalSupplies.filter(s => s.sale_id === sale.id);
        for (const add of additionalInSale) {
          const currentQty = supplyUsageMap.get(add.supply_id) || 0;
          supplyUsageMap.set(add.supply_id, currentQty + add.quantity);
        }
      }

      // 3. Descontar del inventario
      const updatedBatches = [];

      for (const [supply_id, qtyNeeded] of supplyUsageMap.entries()) {
        let remaining = qtyNeeded;

        const batches = allBatches
          .filter(b => b.supply_id === supply_id && b.stock > 0)
          .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

        for (const batch of batches) {
          if (remaining <= 0) break;
          const deduct = Math.min(batch.stock, remaining);
          batch.stock -= deduct;
          remaining -= deduct;
          updatedBatches.push({ ...batch });
        }

        if (remaining > 0) {
          console.warn(`❌ Insufficient stock for supply_id ${supply_id}. Missing: ${remaining}`);
        }
      }

      // 4. Actualizar batches
      const batchUpdatePromises = updatedBatches.map(batch =>
        this.batchService.update(batch.id, batch)
      );

      // 5. Actualizar ventas
      const salesUpdatePromises = selectedSales.map(sale => {
        const original = allSales.find(s => s.id === sale.id);
        if (!original) return Promise.resolve();
        return this.restaurantSaleService.update(sale.id, {
          ...original,
          added_inventory: true
        });
      });

      await Promise.all([...batchUpdatePromises, ...salesUpdatePromises]);

      // 6. Emitir eventos
      setTimeout(() => {
        this.$emit('refecth_sales_updated_in_inventory');
        this.$emit('show-toast', "Successfully discounted from inventory");
        this.closeComponent();
      }, 300);
    } catch (error) {
      console.error("❌ Error en registerSalesToInventory:", error);
    }
  },
    async getAllSalesWithDetails() {
        try {
            // Ejecutar las 3 llamadas en paralelo
            const [sales, salesRecipes, salesSupplies] = await Promise.all([
            this.restaurantSaleService.getAll(),
            this.salesRecipeService.getAll(),
            this.salesAdditionalSupplyService.getAll()
            ]);

            // Agrupar recetas por sale_id
            const recipesMap = new Map();
            salesRecipes.data.forEach(recipe => {
            const key = recipe.sale_id ?? 0;
            recipesMap.set(key, (recipesMap.get(key) || 0) + (recipe.quantity ?? 0));
            });

            // Agrupar insumos adicionales por sale_id
            const suppliesMap = new Map();
            salesSupplies.data.forEach(supply => {
            const key = supply.sale_id ?? 0;
            suppliesMap.set(key, (suppliesMap.get(key) || 0) + (supply.quantity ?? 0));
            });

            // Filtrar y mapear ventas no añadidas al inventario
            this.salesNotAddedToInventoryWithRecipeAndSupplyCounts = sales.data
            .filter(sale => sale.added_inventory === false)
            .map(sale => ({
                id: sale.id,
                code: sale.code,
                diner_name: sale.diner_name,
                recipeCount: recipesMap.get(sale.id ?? -1) || 0,
                additionalSupplyCount: suppliesMap.get(sale.id ?? -1) || 0
            }));

            // Asignar al datasource (si estás usando una tabla)
            this.dataSource = [...this.salesNotAddedToInventoryWithRecipeAndSupplyCounts];
            if(this.dataSource.length>0)
            this.registered_sales_not_discounted_in_inventory = true
            console.log('salesNotAddedToInventoryWithRecipeAndSupplyCounts:', this.salesNotAddedToInventoryWithRecipeAndSupplyCounts);
        } catch (error) {
            console.error('Error al obtener detalles de ventas:', error);
        }
}

  },
  created() {
    this.restaurantSaleService = new RestaurantSaleService();
    this.salesRecipeService = new SalesRecipeService();
    this.salesAdditionalSupplyService = new SalesAdditionalSupplyService();
    this.recipeService = new RecipeService();
    this.supplyService = new SupplyService();
    this.batchService = new SupplyBatchService(); //lotes de inventario
    this.recipeSupplyService = new RecipeSupplyService();
    this.getAllSalesWithDetails();

  }
};
</script>


<template>
  <div class="modal-overlay" @click="closeComponent">
    <div class="modal-content modal-scrollable" @click.stop>
      <button class="close-button" @click="closeComponent">✕</button>

      <div>
        <h2 class="title">{{ $t('sales_restaurant.sales_not_added_in_inventory.title') }}</h2>
        <p v-if="registered_sales_not_discounted_in_inventory" class="sub-text">{{ $t('sales_restaurant.sales_not_added_in_inventory.subtitle') }}</p>
        <div v-if="registered_sales_not_discounted_in_inventory" class="select-all">
            <input
            type="checkbox"
            :checked="isAllSelected"
            :indeterminate="selectedSales.length > 0 && !isAllSelected"
            @change="toggleAllSelection($event.target.checked)"
            />
            <label>{{ $t('sales_restaurant.sales_not_added_in_inventory.selectAll') }}</label>
        </div>
       
      </div>

      <div  v-if="registered_sales_not_discounted_in_inventory" class="content">
        <table class="custom-table">
          <thead>
            <tr>
              <th>{{ $t('sales_restaurant.sales_not_added_in_inventory.code') }}</th>
              <th>{{ $t('sales_restaurant.sales_not_added_in_inventory.quantityDishes') }}</th>
              <th>{{ $t('sales_restaurant.sales_not_added_in_inventory.quantityAdditionalSupplies') }}</th>
              <th>{{ $t('sales_restaurant.sales_not_added_in_inventory.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in dataSource" :key="sale.id">
              <td>{{ sale.code }}</td>
              <td>{{ sale.recipeCount }}</td>
              <td>{{ sale.additionalSupplyCount }}</td>
              <td class="actions">
                <div class="separate">
                  <span class="pi pi-file" @click="openSaleDetail(sale)"></span>
                  <input
                    type="checkbox"
                    :checked="isSelected(sale)"
                    @change="toggleSelection(sale, $event.target.checked)"
                  />
                </div>
              
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="no-registros" v-if="!registered_sales_not_discounted_in_inventory">There are no sales that have not been deducted from inventory.</p>

      <div class="buttons">
        <button class="button-cancel" @click="closeComponent">
          {{ $t('sales_restaurant.sales_not_added_in_inventory.cancel') }} <i class="pi pi-times"></i>
        </button>
        <button v-if="registered_sales_not_discounted_in_inventory" class="button-register" @click="registerSalesToInventory">
          {{ $t('sales_restaurant.sales_not_added_in_inventory.register') }} <i class="pi pi-check-circle"></i>
        </button>
      </div>
    </div>

    <!-- Modal detalle -->
    <SaleDetailModal
      v-if="showModalSaleDetail"
      :sale="selectedSale"
      @close="closeSaleDetailModal"
    />
  </div>
</template>

<style scoped>
    .no-registros {
        text-align: center;
        font-size: 24px;
    }   
    /* register-sales.component.css */
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

    .content {
        margin: 0 2rem 2rem 2rem;
    }

    .close-button {
        position: absolute;
        top: 20px;
        right: 23px;
        z-index: 2;
    }

    .title {
        padding-top: 24px;
        font-family: Poppins;
        font-weight: 400;
        font-size: 20px;
        max-width: 80%;
    }

    .sub-text {
        font-family: Inter;
        font-weight: 400;
        font-size: 18px;
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
        margin-bottom: 16px;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 4rem;
        margin-bottom: 1rem;
        margin-top: 1rem;
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

    .select-all {
        margin-bottom: 1rem;
        display: flex;
        justify-content: end;
        margin-right: 2rem;
    }


   
</style>