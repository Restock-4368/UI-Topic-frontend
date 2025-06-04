import { SupplyBatch } from '../model/supply-batch.entity';

/**
 * @class SupplyBatchAssembler
 * @description Transforms raw data into instances of SupplyBatch and vice versa.
 */
export class SupplyBatchAssembler {
  /**
   * Transforms a plain object into a SupplyBatch entity.
   * @param {Object} raw - Raw data from API
   * @returns {SupplyBatch}
   */
  static toEntity(raw) {
    return new SupplyBatch(raw);
  }

  /**
   * Transforms an array of raw objects into an array of SupplyBatch entities.
   * @param {Object[]} rawList - List of raw data objects from API
   * @returns {SupplyBatch[]}
   */
  static toEntities(rawList) {
    return rawList.map(raw => this.toEntity(raw));
  }

  /**
   * Transforms an Axios response into a list of SupplyBatch entities.
   * @param {import('axios').AxiosResponse<any>} response
   * @returns {SupplyBatch[]}
   */
  static toEntitiesFromResponse(response) {
    return this.toEntities(response.data);
  }

  /**
   * Transforms an Axios response into a single SupplyBatch entity.
   * @param {import('axios').AxiosResponse<any>} response
   * @returns {SupplyBatch}
   */
  static toEntityFromResponse(response) {
    return this.toEntity(response.data);
  }
}
