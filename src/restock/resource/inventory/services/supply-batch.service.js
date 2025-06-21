import httpInstance from "../../../../shared/services/http.instance.js";
import { BaseService } from "../../../../shared/services/base.service.js";

/**
 * @class SupplyBatchService
 * @description Service class for handling CRUD operations on supply batches
 */
const batchesResourceEndpointPath = import.meta.env.VITE_SUPPLY_BATCHES_ENDPOINT_PATH;

export class SupplyBatchService extends BaseService {
  constructor() {
    super();
    this.resourceEndpoint = batchesResourceEndpointPath;
  }
  getBySupplyId(supplyId) {
    return httpInstance.get(`${this.resourceEndpoint}?supply_id=${supplyId}`);
  }
}
