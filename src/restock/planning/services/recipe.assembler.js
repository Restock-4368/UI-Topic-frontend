import { Recipe } from '../model/recipe.entity.js';

export class RecipeAssembler {
    static toEntityFromResource(resource) {
        return new Recipe({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        const resources = Array.isArray(response.data)
            ? response.data
            : response.data.recipes || [];
        return resources.map(r => this.toEntityFromResource(r));
    }

    static toEntityFromResponse(response) {
        if (!response || !response.data) return null;
        return this.toEntityFromResource(response.data);
    }
}