import {BaseService} from "../../../shared/services/base.service.js";
import {Recipe} from "../model/recipe.entity.js";

export class RecipeService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_RECIPES_ENDPOINT_PATH;

    async getAll() {
        const response = await super.getAll();
        return response.data.map(r => new Recipe(r));
    }

    async getById(id) {
        const response = await super.getById(id);
        return new Recipe(response.data);
    }

    async create(recipeData) {
        const response = await super.create(recipeData);
        return new Recipe(response.data);
    }

    async update(id, recipeData) {
        const response = await super.update(id, recipeData);
        return new Recipe(response.data);
    }

    async delete(id) {
        return super.delete(id);
    }
}