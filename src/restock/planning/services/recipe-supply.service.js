import { BaseService } from "../../../shared/services/base.service.js";

export class RecipeSupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_RECIPES_SUPPLIES_ENDPOINT_PATH;

    getByRecipe(recipeId) {
        return this.getByQuery('recipe_id', recipeId);
    }


    async bulkCreate(recipeId, supplies) {
        const requests = supplies.map(s =>
            this.create({
                recipe_id: recipeId,
                supply_id: s.supply_id,
                quantity: s.quantity,
            })
        );
        return Promise.all(requests);
    }

    async deleteByRecipe(recipeId) {
        const response = await this.getByRecipe(recipeId);
        const recipeSupplies = response.data;
        const deletions = recipeSupplies.map(rs => this.delete(rs.id));
        return Promise.all(deletions);
    }
}