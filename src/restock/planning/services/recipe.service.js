import { BaseService } from "../../../shared/services/base.service.js";

export class RecipeService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_RECIPES_ENDPOINT_PATH;

    create(recipeData) {
        const { supplies, ...payload } = recipeData || {};
        return super.create(payload);
    }

    update(id, recipeData) {
        const { supplies, ...payload } = recipeData || {};
        return super.update(id, payload);
    }
}