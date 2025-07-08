import httpInstance from "../../../../shared/services/http.instance.js";
import {BaseService} from "../../../../shared/services/base.service.js";
/**
 * @class SupplyCategoryService
 * @description Service class for handling CRUD operations on supply categories using HTTP requests
 */
export class SupplyCategoryService extends BaseService {
  /** @type {string} The API endpoint for supply categories */
  resourceEndpoint = import.meta.env.VITE_SUPPLY_CATEGORIES_ENDPOINT_PATH;

  /**
   * Retrieves supply categories by name
   * @param {string} name - The name to search for
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching supply categories
   */
  getByName(name) {
    return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
  }
}
