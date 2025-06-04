import httpInstance from "../../../../shared/services/http.instance.js";

/**
 * @class UnitMeasurementService
 * @description Service class for handling CRUD operations on units of measurement
 */
export class UnitMeasurementService {
  /** @type {string} The API endpoint for units of measurement */
  resourceEndpoint = import.meta.env.VITE_UNITS_MEASUREMENT_ENDPOINT_PATH;

  /**
   * Retrieves all units of measurement
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of units
   */
  getAll() {
    return httpInstance.get(this.resourceEndpoint);
  }

  /**
   * Retrieves a unit of measurement by its ID
   * @param {number|string} id - The ID of the unit to retrieve
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the unit object
   */
  getById(id) {
    return httpInstance.get(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Creates a new unit of measurement
   * @param {Object} resource - The unit object to create
   * @param {string} resource.name - The name of the unit (e.g., kg, liter)
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created unit
   */
  create(resource) {
    return httpInstance.post(this.resourceEndpoint, resource);
  }

  /**
   * Updates an existing unit of measurement
   * @param {number|string} id - The ID of the unit to update
   * @param {Object} resource - The updated unit data
   * @param {string} resource.name - The updated name of the unit
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated unit
   */
  update(id, resource) {
    return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
  }

  /**
   * Deletes a unit of measurement by its ID
   * @param {number|string} id - The ID of the unit to delete
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the unit is deleted
   */
  delete(id) {
    return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Retrieves units of measurement by name
   * @param {string} name - The name to search for (e.g., "kg")
   * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching units
   */
  getByName(name) {
    return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
  }
}
