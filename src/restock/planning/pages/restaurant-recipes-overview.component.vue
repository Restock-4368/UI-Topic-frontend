<script>
import EmptySection from '../../../shared/components/empty-section.component.vue';
import CreateAndEdit from '../../../shared/components/create-and-edit.component.vue';
import AddAndEditForm from '../../../shared/components/add-and-edit.component.vue';
import DeleteConfirmation from '../../../shared/components/delete.component.vue';
import SupplySelector from '../components/supply-selector.component.vue';
import {RecipeService} from "../services/recipe.service.js";
import {RecipeSupplyService} from "../services/recipe-supply.service.js";
import {RecipeAssembler} from "../services/recipe.assembler.js";
import {RecipeSupplyAssembler} from "../services/recipe-supply.assembler.js";
import {SupplyService} from "../../resource/inventory/services/supply.service.js";

export default {
  name: 'RestaurantRecipesOverview',
  components: {
    EmptySection,
    CreateAndEdit,
    AddAndEditForm,
    DeleteConfirmation,
    SupplySelector,
  },
  data() {
    return {
      recipes: [],
      search: '',
      formVisible: false,
      editMode: 'create',
      formModel: {},
      selectedRecipe: null,
      deleteVisible: false,
      recipeService: new RecipeService(),
      sortByPrice: false,
      recipeSupplyService: new RecipeSupplyService(),
      detailsVisible: false,
      supplyService: new SupplyService(),
      allSupplies: []
    };
  },
  computed: {
    filteredRecipes() {
      let filtered = this.recipes.filter(r =>
          r.name.toLowerCase().includes(this.search.toLowerCase())
      );

      if (this.sortByPrice) {
        return filtered.sort((a, b) => a.total_price - b.total_price);
      }

      return filtered;
    },
    formSchema() {
      return [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Recipe name'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          placeholder: 'Short description'
        },
        {
          name: 'total_price',
          label: 'Total Price (S/.)',
          type: 'number',
          placeholder: 'e.g. 29.90',
          format: 'currency',
        },
        {
          name: 'image_url',
          label: 'Dish Image',
          placeholder: 'Upload an image',
          type: 'file'
        }
      ];
    },
  },
  async created() {
    this.allSupplies = await this.loadAllSupplies();
    await this.loadRecipes();
  },
  methods: {
    async loadAllSupplies() {
      const response = await this.supplyService.getAll();
      return response.data;
    },
    async loadRecipes() {
      const response = await this.recipeService.getAll();
      const recipes = RecipeAssembler.toEntitiesFromResponse(response);
      const enhanced = await Promise.all(
          recipes.map(async r => {
            const respSupplies = await this.recipeSupplyService.getByRecipe(r.id)
            const supplies = RecipeSupplyAssembler.toEntitiesFromResponse(respSupplies);
            return {...r, supplies};
          })
      );
      this.recipes = enhanced;
    },
    openCreateDialog() {
      this.editMode = 'create';
      this.formModel = {
        supplies: [],
        user_id: 1
      };
      this.formVisible = true;
    },
    async openEditDialog(recipe) {
      const respSupplies = await this.recipeSupplyService.getByRecipe(recipe.id);
      const supplies = RecipeSupplyAssembler.toEntitiesFromResponse(respSupplies);
      this.formModel = {...recipe, supplies};
      this.editMode = 'edit';
      this.formVisible = true;
    },
    closeForm() {
      this.formVisible = false;
    },
    async submitForm(form) {
      if (this.editMode === 'create') {
        const response = await this.recipeService.create(form);
        const created = RecipeAssembler.toEntityFromResponse(response);

        await this.recipeSupplyService.bulkCreate(created.id, form.supplies);
      } else {
        await this.recipeSupplyService.deleteByRecipe(form.id);
        await this.recipeSupplyService.bulkCreate(form.id, form.supplies);
        await this.recipeService.update(form.id, form);
      }

      await this.loadRecipes();
      this.closeForm();
    },

    openDeleteDialog(recipe) {
      this.selectedRecipe = recipe;
      this.deleteVisible = true;
    },
    async confirmDelete() {
      await this.recipeService.delete(this.selectedRecipe.id);
      await this.recipeSupplyService.deleteByRecipe(this.selectedRecipe.id);
      this.deleteVisible = false;
      this.selectedRecipe = null;
      await this.loadRecipes();
    },
    async recipeDetails(recipe) {
      const respSupplies = await this.recipeSupplyService.getByRecipe(recipe.id);
      const rawSupplies = RecipeSupplyAssembler.toEntitiesFromResponse(respSupplies);

      const enrichedSupplies = rawSupplies.map(rs => {
        const supply = this.allSupplies.find(s => s.id === rs.supply_id);
        return {
          ...rs,
          supply
        };
      });

      this.selectedRecipe = {
        ...recipe,
        supplies: enrichedSupplies
      };

      this.detailsVisible = true;
    }


  },
};
</script>

<template>
  <div class="recipes-view p-4">
    <!-- Header -->
    <div
        class="recipes-header flex flex-column sm:flex-row justify-content-between sm:align-items-center flex-wrap gap-3 sm:gap-4 mb-4">

      <div class="recipes-header__top">
        <h2 class="text-2xl font-semibold mr-2">{{ $t('recipes.title') }}</h2>
      </div>

      <div class="recipes-header__middle flex flex-row flex-wrap align-items-center gap-2 sm:gap-5 ">
        <pv-input-text
            v-model="search"
            placeholder="Search recipes..."
            class="w-full sm:w-30rem"
        />

        <div class="flex align-items-center gap-2">
          <label for="sortByPrice" class="text-sm text-color-secondary">Sort by price</label>
          <pv-input-switch
              v-model="sortByPrice"
              inputId="sortByPrice"
          />
        </div>
      </div>

      <div class="recipes-header__actions">
        <pv-button
            label="Create"
            icon="pi pi-plus-circle"
            @click="openCreateDialog"
            class="green-button w-full sm:w-auto font-semibold px-3 py-2"
        />
      </div>
    </div>


    <!-- Empty -->
    <empty-section v-if="filteredRecipes.length === 0">
      <template #icon>
        <i class="pi pi-clipboard" style="font-size: 3rem; color: #bcbcbc;"></i>
      </template>
      You currently have no recipes registered. Create a new recipe to start organizing your preparations and better
      manage your ingredients from this section.
    </empty-section>

    <!-- Grid -->
    <div v-else class="recipes-grid">
      <div v-for="recipe in filteredRecipes"
           :key="recipe.id"
           class="recipe-card"
           @click="recipeDetails(recipe)"
      >
        <img :src="recipe.image_url" alt="Dish image"/>
        <h3>{{ recipe.name }}</h3>
        <p>Total cost: S/.{{ recipe.total_price }}</p>
        <div class="recipe-card__actions">
          <pv-button icon="pi pi-pencil" @click="openEditDialog(recipe)" outlined/>
          <pv-button icon="pi pi-trash" severity="danger" @click="openDeleteDialog(recipe)" outlined/>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT Modal -->
    <create-and-edit
        v-model="formVisible"
        :mode="editMode"
        createTitle="Create Recipe"
        editTitle="Edit Recipe"
        @close="closeForm"
    >
      <add-and-edit-form
          :schema="formSchema"
          :initialData="formModel"
          :mode="editMode"
          @submit="submitForm"
      >
        <template #extension="{ form }">
          <h4 class="mt-4 mb-2">Recipe Supplies</h4>
          <SupplySelector v-model="form.supplies"/>
        </template>
      </add-and-edit-form>
    </create-and-edit>

    <DeleteConfirmation
        v-model="deleteVisible"
        :label="selectedRecipe?.name"
        @confirm="confirmDelete"
        @cancel="deleteVisible = false"
    />


    <pv-dialog
        v-model:visible="detailsVisible"
        modal
        :style="{
          width: 'auto',
          height: 'auto',
        }"
        :closable="true"
    >

      <div class="modal-content">
        <h3>{{ selectedRecipe.name }}</h3>
        <p>{{ selectedRecipe.description }}</p>
        <img :src="selectedRecipe.image_url" alt="Recipe image" style="max-width: 100%;">
        <p>Total Price: S/. {{ selectedRecipe.total_price }}</p>

        <h4>Supplies:</h4>
        <ul>
          <li v-for="s in selectedRecipe.supplies" :key="s.supply.id">
            {{ s.supply.name }} - {{ s.quantity }} unit(s)
          </li>
        </ul>

      </div>
    </pv-dialog>

  </div>
</template>


<style scoped>

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.recipe-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.recipe-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
}

.recipe-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 30px;
  max-width: 400px;
  width: 100%;
}
</style>
