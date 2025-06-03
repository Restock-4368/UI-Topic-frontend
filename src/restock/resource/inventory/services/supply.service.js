import httpInstance from "../../../../shared/services/http.instance.js";

/**
 * @class SupplyService
 * @description Service class for handling CRUD operations on supplies using HTTP requests
 */
export class SupplyService {
  /** @type {string} The API endpoint for supplies */
  resourceEndpoint = import.meta.env.VITE_SUPPLIES_ENDPOINT_PATH;

  /**
   * Retrieves all supplies
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of supplies
   */
  getAll() {
    return httpInstance.get(this.resourceEndpoint);
  }

  /**
   * Retrieves a supply by its ID
   * @param {number|string} id - The ID of the supply to retrieve
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the supply object
   */
  getById(id) {
    return httpInstance.get(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Creates a new supply
   * @param {Object} resource - The supply object to create
   * @param {string} resource.name - The name of the supply
   * @param {string} resource.description - The description of the supply
   * @param {boolean} resource.perishable - Whether the supply is perishable
   * @param {number} resource.min_stock - Minimum stock quantity
   * @param {number} resource.max_stock - Maximum stock quantity
   * @param {number|string} resource.category_id - ID of the supply category
   * @param {number|string} resource.unit_measurement_id - ID of the unit measurement
   * @param {number} resource.price - Price of the supply
   * @param {number|string} resource.user_id - ID of the user who manages the supply
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created supply
   */
  create(resource) {
    return httpInstance.post(this.resourceEndpoint, resource);
  }

  /**
   * Updates an existing supply
   * @param {number|string} id - The ID of the supply to update
   * @param {Object} resource - The updated supply data
   * @param {string} resource.name - The name of the supply
   * @param {string} resource.description - The description of the supply
   * @param {boolean} resource.perishable - Whether the supply is perishable
   * @param {number} resource.min_stock - Minimum stock quantity
   * @param {number} resource.max_stock - Maximum stock quantity
   * @param {number|string} resource.category_id - ID of the supply category
   * @param {number|string} resource.unit_measurement_id - ID of the unit measurement
   * @param {number} resource.price - Price of the supply
   * @param {number|string} resource.user_id - ID of the user who manages the supply
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated supply
   */
  update(id, resource) {
    return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
  }

  /**
   * Deletes a supply by its ID
   * @param {number|string} id - The ID of the supply to delete
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the supply is deleted
   */
  delete(id) {
    return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Retrieves supplies by description
   * @param {string} description - The description to search for
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching supplies
   */
  getByDescription(description) {
    return httpInstance.get(`${this.resourceEndpoint}?description=${encodeURIComponent(description)}`);
  }
}
