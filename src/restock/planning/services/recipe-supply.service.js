
import {BaseService} from "../../../shared/services/base.service.js";
import httpInstance from "../../../shared/services/http.instance.js";

export class RecipeSupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_RECIPES_ENDPOINT_PATH;

    getByRecipe(recipeId) {
        return httpInstance.get(`${this.resourceEndpoint}/${recipeId}/supplies`);
    }

    async bulkCreate(recipeId, supplies) {
        return httpInstance.post(
            `${this.resourceEndpoint}/${recipeId}/supplies`, supplies);
    }

    deleteById(recipeId, supplyId) {
        return httpInstance.delete(`${this.resourceEndpoint}/${recipeId}/supplies/${supplyId}`);
    }

    async deleteByRecipe(recipeId) {
        const response = await this.getByRecipe(recipeId);
        const recipeSupplies = response.data;
        const deletions = recipeSupplies.map(rs => this.deleteById(recipeId, rs.supply_id));
        return Promise.all(deletions);
    }


    updateById(recipeId, id, data) {
        return httpInstance.put(
            `${this.resourceEndpoint}/${recipeId}/supplies/${id}`,
            data
        );
    }
}