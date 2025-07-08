export class BusinessCategoryAssembler {
    static toEntityFromResource(resource) {
        return {
            id: resource.id,
            name: resource.name
        };
    }

    static toEntitiesFromResources(resources) {
        return resources.map(res => this.toEntityFromResource(res));
    }
}