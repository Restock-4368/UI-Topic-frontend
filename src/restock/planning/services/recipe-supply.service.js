import {BaseService} from "../../../shared/services/base.service.js";
import {RecipeSupply} from "../model/recipe-supply.entity.js";

export class RecipeSupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_RECIPES_SUPPLIES_ENDPOINT_PATH;

    async getByRecipe(recipeId) {
        const response = await this.getByQuery('recipe_id', recipeId);
        return response.data.map(rs => new RecipeSupply(rs));
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
        const recipeSupplies = await this.getByRecipe(recipeId);
        const deletions = recipeSupplies.map(rs => this.delete(rs.id));
        return Promise.all(deletions);
    }
}