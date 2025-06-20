import { RecipeSupply } from '../model/recipe-supply.entity.js';

export class RecipeSupplyAssembler {
    static toEntity(resource) {
        return new RecipeSupply(resource);
    }

    static toEntities(resources) {
        return resources.map(r => this.toEntity(r));
    }

    static toEntitiesFromResponse(response) {
        return this.toEntities(response.data);
    }

    static toEntityFromResponse(response) {
        return this.toEntity(response.data);
    }
}