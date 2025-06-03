import { Supply } from "../model/supply.entity.js";

/**
 * @class SupplyAssembler
 * @description Transforms raw resources or API responses into Supply entities
 */
export class SupplyAssembler {
  /**
   * Converts a raw supply resource to a Supply entity
   * @param {Object} resource - Raw supply data from the API
   * @returns {Supply} A new instance of the Supply entity
   */
  static toEntityFromResource(resource) {
    return new Supply({ ...resource });
  }

  /**
   * Converts a successful Axios response to an array of Supply entities
   * @param {AxiosResponse<any>} response - The Axios response from the service
   * @returns {Supply[]} Array of Supply entities
   */
  static toEntitiesFromResponse(response) {
    if (response.data.status && response.data.status !== 'ok') {
      console.error(`${response.data.status}: ${response.data.message}`);
      return [];
    }

    const resources = Array.isArray(response.data) ? response.data : response.data.supplies || [];
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a single Axios response to one Supply entity
   * @param {AxiosResponse<any>} response - The Axios response with a single supply
   * @returns {Supply|null} A Supply entity or null if error
   */
  static toEntityFromResponse(response) {
    if (!response || !response.data) return null;
    return this.toEntityFromResource(response.data);
  }
}
