import httpInstance from "../../../../shared/services/http.instance.js";
import {BaseService} from "../../../../shared/services/base.service.js";

/**
 * @class SupplyBatchService
 * @description Service class for handling CRUD operations on supply batches
 */
export class SupplyBatchService extends BaseService {
  /** @type {string} The API endpoint for supply batches */
  resourceEndpoint = import.meta.env.VITE_SUPPLY_BATCHES_ENDPOINT_PATH;

  /**
   * Retrieves batches by supply ID
   * @param {number|string} supplyId - The supply ID to filter by
   * @returns {Promise<AxiosResponse<any>>}
   */
  getBySupplyId(supplyId) {
    return httpInstance.get(`${this.resourceEndpoint}?supply_id=${supplyId}`);
  }
}
