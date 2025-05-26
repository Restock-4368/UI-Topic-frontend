<script>
import EmptySection from '../../../shared/components/empty-section.component.vue';
import {Button as PvButton, InputText as PvInputText} from "primevue";

export default {
  name: 'RecipesView',
  components: {
    PvButton,
    PvInputText,
    EmptySection,
  },
  data() {
    return {
      search: '',
      sortByPrice: false,
    };
  },
};
</script>

<template>
  <div class="recipes-view">
    <div class="recipes-header">
      <div class="recipes-header__top">
        <h2 class="recipes-header__title">Recipes</h2>
      </div>
      <div class="recipes-header__controls">
        <pv-input-text
            v-model="search"
            placeholder="Buscar recetas"
            class="recipes-header__search"
        />
        <ToggleSwitch
            v-model="sortByPrice"
            class="recipes-header__control"
        />
        <pv-button
            label="Create"
            icon="pi pi-plus"
            class="recipes-header__control"
        />
      </div>
    </div>

    <EmptySection>
      <template #icon>
        <i class="pi pi-clipboard" style="font-size: 3rem; color: #bcbcbc;"></i>
      </template>
      You currently have no recipes registered. Create a new recipe to start organizing your preparations and better
      manage your ingredients from this section.
    </EmptySection>
  </div>
</template>

<style>
.recipes-header {
  display: flex;
  flex-direction: row;
  gap: 5rem;
  padding: 3rem;
  justify-content: center;
}

.recipes-header__top {
  display: flex;
  align-items: center;
}

.recipes-header__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: #2e2e2e;
}

.recipes-header__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.recipes-header__search {
  min-width: 500px;
}



</style>

