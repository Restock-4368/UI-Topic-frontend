import httpInstance from "../../../../shared/services/http.instance.js";
import {BaseService} from "../../../../shared/services/base.service.js";

/**
 * @class SupplyService
 * @description Service class for handling CRUD operations on supplies using HTTP requests
 */
export class SupplyService extends BaseService {
  /** @type {string} The API endpoint for supplies */
  resourceEndpoint = import.meta.env.VITE_SUPPLIES_ENDPOINT_PATH;

  /**
   * Retrieves supplies by description
   * @param {string} description - The description to search for
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching supplies
   */
  getByDescription(description) {
    return httpInstance.get(`${this.resourceEndpoint}?description=${encodeURIComponent(description)}`);
  }
}
