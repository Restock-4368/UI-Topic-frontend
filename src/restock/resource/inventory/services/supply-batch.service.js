import httpInstance from "../../../../shared/services/http.instance.js";

/**
 * @class SupplyBatchService
 * @description Service class for handling CRUD operations on supply batches
 */
export class SupplyBatchService {
  /** @type {string} The API endpoint for supply batches */
  resourceEndpoint = import.meta.env.VITE_SUPPLY_BATCHES_ENDPOINT_PATH;

  /**
   * Retrieves all supply batches
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of supply batches
   */
  getAll() {
    return httpInstance.get(this.resourceEndpoint);
  }

  /**
   * Retrieves a supply batch by its ID
   * @param {number|string} id - The ID of the batch
   * @returns {Promise<AxiosResponse<any>>}
   */
  getById(id) {
    return httpInstance.get(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Creates a new supply batch
   * @param {Object} batch - The batch object to create
   * @param {number|string} batch.supply_id - Associated supply ID
   * @param {number} batch.stock - Quantity of the supply in this batch
   * @param {string|null} batch.expiration_date - Expiration date (nullable)
   * @returns {Promise<AxiosResponse<any>>}
   */
  create(batch) {
    return httpInstance.post(this.resourceEndpoint, batch);
  }

  /**
   * Updates an existing supply batch
   * @param {number|string} id - The ID of the batch to update
   * @param {Object} batch - Updated batch data
   * @returns {Promise<AxiosResponse<any>>}
   */
  update(id, batch) {
    return httpInstance.put(`${this.resourceEndpoint}/${id}`, batch);
  }

  /**
   * Deletes a supply batch
   * @param {number|string} id - The ID of the batch to delete
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(id) {
    return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Retrieves batches by supply ID
   * @param {number|string} supplyId - The supply ID to filter by
   * @returns {Promise<AxiosResponse<any>>}
   */
  getBySupplyId(supplyId) {
    return httpInstance.get(`${this.resourceEndpoint}?supply_id=${supplyId}`);
  }
}
