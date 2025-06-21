import { BaseService } from "../../../../shared/services/base.service";

const salesAdditionalSuppliesResourceEndpointPath = import.meta.env.VITE_SALES_ADDITIONAL_SUPPLIES_ENDPOINT_PATH;

export class SalesAdditionalSupplyService extends BaseService {
    constructor() {
        super();
        this.resourceEndpoint = salesAdditionalSuppliesResourceEndpointPath;
    }
}
