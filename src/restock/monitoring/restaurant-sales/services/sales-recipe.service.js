import { BaseService } from "../../../../shared/services/base.service";

const salesRecipesResourceEndpointPath = import.meta.env.VITE_SALES_RECIPES_ENDPOINT_PATH;

export class SalesRecipeService extends BaseService {
    constructor() {
        super();
        this.resourceEndpoint = salesRecipesResourceEndpointPath;
    }
}
