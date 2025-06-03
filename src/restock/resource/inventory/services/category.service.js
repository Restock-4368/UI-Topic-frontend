import httpInstance from "../../../../shared/services/http.instance.js";
/**
 * @class SupplyCategoryService
 * @description Service class for handling CRUD operations on supply categories using HTTP requests
 */
export class SupplyCategoryService {
  /** @type {string} The API endpoint for supply categories */
  resourceEndpoint = import.meta.env.VITE_SUPPLY_CATEGORIES_ENDPOINT_PATH;

  /**
   * Retrieves all supply categories
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of supply categories
   */
  getAll() {
    return httpInstance.get(this.resourceEndpoint);
  }

  /**
   * Retrieves a supply category by its ID
   * @param {number|string} id - The ID of the supply category to retrieve
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the supply category object
   */
  getById(id) {
    return httpInstance.get(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Creates a new supply category
   * @param {Object} resource - The supply category object to create
   * @param {string} resource.name - The name of the supply category
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created supply category
   */
  create(resource) {
    return httpInstance.post(this.resourceEndpoint, resource);
  }

  /**
   * Updates an existing supply category
   * @param {number|string} id - The ID of the supply category to update
   * @param {Object} resource - The updated supply category data
   * @param {string} resource.name - The updated name of the supply category
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated supply category
   */
  update(id, resource) {
    return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
  }

  /**
   * Deletes a supply category by its ID
   * @param {number|string} id - The ID of the supply category to delete
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the supply category is deleted
   */
  delete(id) {
    return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Retrieves supply categories by name
   * @param {string} name - The name to search for
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching supply categories
   */
  getByName(name) {
    return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
  }
}
