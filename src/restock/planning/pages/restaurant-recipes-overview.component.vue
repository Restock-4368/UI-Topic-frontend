<script>
import EmptySection from '../../../shared/components/empty-section.component.vue';
import CreateAndEdit from '../../../shared/components/create-and-edit.component.vue';
import AddAndEditForm from '../../../shared/components/add-and-edit.component.vue';
import DeleteConfirmation from '../../../shared/components/delete.component.vue';
import SupplySelector from '../components/supply-selector.component.vue';
import {RecipeService} from "../services/recipe.service.js";

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
  created() {
    this.loadRecipes();
  },
  methods: {
    async loadRecipes() {
      this.recipes = await this.recipeService.getAll();
    },
    openCreateDialog() {
      this.editMode = 'create';
      this.formModel = { supplies: [] };
      this.formVisible = true;
    },
    openEditDialog(recipe) {
      this.editMode = 'edit';
      this.formModel = { ...recipe, supplies: recipe.supplies || [] };
      this.formVisible = true;
    },
    closeForm() {
      this.formVisible = false;
    },
    async submitForm(data) {
      console.log('🔁 Form submitted:', data); // ✅ ¿Se imprime esto?

      if (!data.supplies || data.supplies.length === 0) {
        alert('You must add at least one supply.');
        return;
      }

      const response = this.editMode === 'create'
          ? await this.recipeService.create(data)
          : await this.recipeService.update(this.formModel.id, data);

      console.log('✅ Backend response:', response);

      this.formVisible = false;
      await this.loadRecipes();
    },
    openDeleteDialog(recipe) {
      this.selectedRecipe = recipe;
      this.deleteVisible = true;
    },
    async confirmDelete() {
      await this.recipeService.delete(this.selectedRecipe.id);
      this.deleteVisible = false;
      this.selectedRecipe = null;
      await this.loadRecipes();
    },
  },
};
</script>

<template>
  <div class="recipes-view p-4">
    <!-- Header -->
    <div class="recipes-header flex flex-column sm:flex-row justify-content-between sm:align-items-center flex-wrap gap-3 sm:gap-4 mb-4">

      <div class="recipes-header__top">
        <h2 class="text-2xl font-semibold mr-2">Recipes</h2>
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
    <EmptySection v-if="filteredRecipes.length === 0">
      <template #icon>
        <i class="pi pi-clipboard" style="font-size: 3rem; color: #bcbcbc;"></i>
      </template>
      You currently have no recipes registered. Create a new recipe to start organizing your preparations and better manage your ingredients from this section.
    </EmptySection>

    <!-- Grid -->
    <div v-else class="recipes-grid">
      <div v-for="recipe in filteredRecipes" :key="recipe.id" class="recipe-card">
        <img :src="recipe.image_url" alt="Dish image" />
        <h3>{{ recipe.name }}</h3>
        <p>Total cost: S/.{{ recipe.total_price }}</p>
        <div class="recipe-card__actions">
          <pv-button icon="pi pi-pencil" @click="openEditDialog(recipe)" outlined />
          <pv-button icon="pi pi-trash" severity="danger" @click="openDeleteDialog(recipe)" outlined />
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT Modal -->
    <CreateAndEdit
        v-model="formVisible"
        :mode="editMode"
        createTitle="Create Recipe"
        editTitle="Edit Recipe"
        @close="closeForm"
    >
      <AddAndEditForm
          :schema="formSchema"
          :initialData="formModel"
          :mode="editMode"
          @submit="submitForm"
      >
        <template #extension="{ form }">
          <h4 class="mt-4 mb-2">Recipe Supplies</h4>
          <SupplySelector v-model="form.supplies" />
        </template>
      </AddAndEditForm>
    </CreateAndEdit>

    <DeleteConfirmation
        v-model="deleteVisible"
        :label="selectedRecipe?.name"
        @confirm="confirmDelete"
        @cancel="deleteVisible = false"
    />

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
</style>
