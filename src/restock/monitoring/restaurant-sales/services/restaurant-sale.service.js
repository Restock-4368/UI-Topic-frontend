import { BaseService } from "../../../../shared/services/base.service";

const restaurantSalesResourceEndpointPath = import.meta.env.VITE_SALES_ENDPOINT_PATH;

export class RestaurantSaleService extends BaseService {
    constructor() {
        super();
        this.resourceEndpoint = restaurantSalesResourceEndpointPath;
    }
}
