<script>
import { RestaurantSaleService } from '../services/restaurant-sale.service';
import { SalesRecipeService } from '../services/sales-recipe.service';
import { SalesAdditionalSupplyService } from '../services/sales-additional-supply.service';
import { RecipeService } from '../../../planning/services/recipe.service';
import { SupplyService } from '../../../resource/inventory/services/supply.service';
import SaleDetailComponent from '../components/sale-detail.component.vue';
import RegisterSaleComponent from '../components/register-sales.component.vue';
import ShowSalesNotAddedToInventoryComponent from '../components/show-sales-not-added-to-inventory.component.vue';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'sales',
  components: {
    SaleDetailComponent,
    RegisterSaleComponent,
    ShowSalesNotAddedToInventoryComponent
  },
  setup() {
    const toast = useToast();

    return {
      toast
    };
  },
  data() {
    return {
        //services
        restaurantSaleService: null,
        salesAdditionalSupplyService: null,
        recipeService: null,
        supplyService: null,

        //Modal visibility flags
        showModalRegisterSale: false,
        showModalSaleConfirmation: false,
        showModalSalesNotAddedToInventory: false,
        showModalSaleDetail: false,

        //arreglo geenrado para mostrar las ventas con varaibles personalizadas
        salesWithRecipeAndSupplyCounts: [],


        showHistorySalesAddedInInventory: true,

        //sale selccionado para pasarle a el modal de detalle
        selectedSale: null,

        //Filtro de búsqueda
        filteredSales: [],           // ¡Esto es clave!
        filterValue: '',
    }
  },
  methods: {
    generateRandomCode(length = 6) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    getRandomName() {
      const names = ['Juan', 'María', 'Luis', 'Ana', 'Pedro', 'Lucía', 'Carlos', 'Sofía', 'Miguel', 'Valeria'];
      return names[Math.floor(Math.random() * names.length)];
    },
    async onRegisterSale(data) {
        try {
            console.log("Registering sale with data: ", data);
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

            const newSale = {
                code: this.generateRandomCode(),
                diner_name: this.getRandomName(),
                admin_restaurant_id: 1,
                date: formattedDate,
                added_inventory: false
            };

            const response = await this.restaurantSaleService.create(newSale);
            const saleId = response.id;
            console.log('Venta registrada con ID:', saleId);
            const recipeRequests = Array.isArray(data.dishes)? data.dishes.map((dish) => {
            const saleRecipe = {
                sale_id: saleId,
                recipe_id: dish.id,
                quantity: dish.quantity
            };
            return this.salesRecipeService.create(saleRecipe);
            }):[];

            const supplyRequests = Array.isArray(data.additionalSupplies)? data.additionalSupplies.map((supply) => {
            const saleAdditionalSupply = {
                sale_id: saleId,
                supply_id: supply.id,
                quantity: supply.quantity
            };
            return this.salesAdditionalSupplyService.create(saleAdditionalSupply);
            }):[];

            await Promise.all([...recipeRequests, ...supplyRequests]);

            console.log('Todos los registros creados exitosamente');

            // Solo luego de guardar todo actualizas la tabla
            setTimeout(() => {
                this.getAllSalesWithDetails();
            }, 300);

            // Mostrar toast confirmación
            this.showToastSuccess("Sale created succesfully")
            //Cerrar el modal de registro de venta
            this.showModalRegisterSale = false;

        } catch (error) {
            console.error('Error al registrar venta:', error);
        }
    },
    openRegisterSaleModal() {
      this.showModalRegisterSale = true;
    },
    openSalesNotAddedToInventoryModal() {
        this.showModalSalesNotAddedToInventory = true;
    },
    async openSaleDetail(sale) {
        console.log('Opening sale detail for:', sale);
        const saleId = sale.id;

        try {
        const [recipes, additionalSupplies, allRecipes, allSupplies] = await Promise.all([
            this.salesRecipeService.getByQuery("sale_id", saleId),
            this.salesAdditionalSupplyService.getByQuery("sale_id", saleId),
            this.recipeService.getAll(),
            this.supplyService.getAll()
        ]);

        const enrichedDishes = recipes.data.map(sr => {
            const recipe = allRecipes.data.find(r => r.id === sr.recipe_id);
            return {
            name: recipe?.name || 'Desconocido',
            unitPrice: recipe?.total_price || 0,
            quantity: sr.quantity
            };
        });

        const enrichedSupplies = additionalSupplies.data.map(sas => {
            const supply = allSupplies.data.find(s => s.id === sas.supply_id);
            return {
            name: supply?.name || 'Desconocido',
            unitPrice: supply?.price || 0,
            quantity: sas.quantity
            };
        });

        // Pasar todo al modal
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
  },

    async getAllSalesWithDetails() {
      try {
        // Ejecutar todas las llamadas en paralelo
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

        // Crear arreglo final
        this.salesWithRecipeAndSupplyCounts = sales.data
          .filter(sale => sale.added_inventory === true)
          .map(sale => ({
            id: sale.id,
            code: sale.code,
            diner_name: sale.diner_name,
            recipeCount: recipesMap.get(sale.id ?? -1) || 0,
            additionalSupplyCount: suppliesMap.get(sale.id ?? -1) || 0
          }));

        this.filteredSales = this.salesWithRecipeAndSupplyCounts;
        
        if (this.salesWithRecipeAndSupplyCounts.length === 0) {
                this.showHistorySalesAddedInInventory = false;
        }
      } catch (error) {
        console.error("Error al obtener ventas con detalles:", error);
      }
    },
    showToastSuccess(message) {
         this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000
        });
    }
  },
  watch: {
    filterValue(newValue) {
        this.filteredSales = this.salesWithRecipeAndSupplyCounts.filter(sale =>
        sale.code?.toLowerCase().includes(newValue.toLowerCase())
        );
    },
 },
  created() {
    this.restaurantSaleService = new RestaurantSaleService();
    this.salesRecipeService = new SalesRecipeService();
    this.salesAdditionalSupplyService = new SalesAdditionalSupplyService();
    this.recipeService = new RecipeService();
    this.supplyService = new SupplyService();
    this.getAllSalesWithDetails();
  }
}
</script>


<template>
  <pv-toast position="top-right" />
  <div class="ventas-container">
    <div class="ventas-header">
        <h2>{{ $t('sales_restaurant.register_sale') }}</h2>
        
        <pv-button
            :label="$t('sales_restaurant.new_sale')"
            icon="pi pi-plus"
            iconPos="right"
            class="nueva-venta-btn"
            @click="openRegisterSaleModal"
        />
    </div>
    <hr class="my-3 border-top-1 border-300" />

    <p class="text-question">{{ $t('sales_restaurant.update_inventory') }}</p>

    <pv-button
        class="registered-sales-btn"
        @click="openSalesNotAddedToInventoryModal"
        icon="pi pi-list"
        iconPos="right"
        :label="$t('sales_restaurant.registered_sales_not_discounted')"
    />

    <!-- Display when there are no recorded sales discounted in inventory -->
    <div v-if="!showHistorySalesAddedInInventory" class="ventas-empty">
        <p class="ventas-text">
        You currently have no recorded sales. Enter your sales here to keep your inventory up to date.
        </p>
        <i class="pi pi-server ventas-icon"/>
    </div>

    <!-- Display sales that are discounted in inventory -->
    <div v-if="showHistorySalesAddedInInventory">
        <div class="flex-title-history-sales">
            <i class="pi pi-history"></i>
            <p>{{ $t('sales_restaurant.history_sales') }}</p>
        </div>

        <p class="subtitle">{{ $t('sales_restaurant.registered_sales') }}</p>

        <!-- Filtro de búsqueda -->
        <pv-input-text
        v-model="filterValue"
        :placeholder="$t('sales_restaurant.search')"
        class="filter-field"
        />

        <!-- Table displayinf sales -->
        <div class="table-container">
            <pv-data-table
                :value="filteredSales"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 15]"
                responsiveLayout="scroll"
                class="full-width-table"
            >
                <pv-column field="code" :header="$t('sales_restaurant.code')" />
                <pv-column field="recipeCount" :header="$t('sales_restaurant.quantity_dishes')" />
                <pv-column field="additionalSupplyCount" :header="$t('sales_restaurant.quantity_additional_supplies')" />
                <pv-column :header="$t('sales_restaurant.actions')">
                <template #body="{ data }">
                    <i class="pi pi-file" style="cursor: pointer;" @click="openSaleDetail(data)"></i>
                </template>
                </pv-column>
            </pv-data-table>
        </div>
    </div>

    <!-- Modales -->
    <SaleDetailComponent
        v-if="showModalSaleDetail"
        :sale="selectedSale"
        @close="closeSaleDetailModal"
    />
    <RegisterSaleComponent
        v-if="showModalRegisterSale"
        @close="showModalRegisterSale = false"
        @registerSale="onRegisterSale"
    />
    <ShowSalesNotAddedToInventoryComponent
        v-if="showModalSalesNotAddedToInventory"
        @close="showModalSalesNotAddedToInventory = false"
        @refecth_sales_updated_in_inventory="getAllSalesWithDetails"
        @show-toast="showToastSuccess"

        
    />
  </div>


</template>

<style>
.ventas-container {
    padding-left: 25px;
    padding-right: 25px;
    margin: 0 2rem 3rem 2rem;
}

.supplier-text {
    font-size: 23px;
    font-weight: 400;
}

.ventas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nueva-venta-btn {
    background-color: #4F8A5B !important;
    color: white !important;
    border-radius: 2px;
    padding: 15px;
}

.btn-content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 14px;
}

mat-divider {
    margin-top: 2rem;
}


.ventas-empty {
    text-align: center;
    margin-top: 40px;
    color: #7f8c8d;
}

.ventas-text {
    font-size: 16px;
    margin-bottom: 24px;
}

.ventas-icon {
    font-size: 100px !important;
    color: #7f8c8d;
}

mat-paginator {
    background-color: white;
    margin-left: auto;
}

.full-width-table {
    background-color: white;
}

.table-container {
    margin: 3rem 3rem 0 3rem;
}

.flex {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: auto;
}

.filter-field {
    margin-top: 1rem;
    width: 30%;
    border: 2px;
}

.flex-title-history-sales {
    margin-top: 3rem;
    font-family: Poppins;
    font-weight: 400;
    font-size: 23px;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 40px;
}


.subtitle {
    font-family: Poppins;
    font-weight: 400;
    font-size: 12px;
    margin-top: 0;
}

.text-question {
    font-family: Poppins;
    font-weight: 400;
    font-size: 18px;
    margin-top: 2rem;
}

.registered-sales-btn {
    background-color: #F28C38 !important;
    color: white !important;
    border-radius: 2px;
    border-color: #F28C38 !important;
    padding: 15px;
}
</style>