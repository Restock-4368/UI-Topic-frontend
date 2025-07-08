/**
 * @class SupplyBatch
 * @description Represents a batch of a specific supply with stock and expiration date
 */
export class SupplyBatch {
  /**
   * @param {Object} data - The data object to initialize the supply batch
   * @param {number|string} data.id - Unique identifier of the batch
   * @param {number|string} data.supply_id - Associated supply ID
   * @param {number} data.stock - Quantity of the supply in this batch
   * @param {string|null} data.expiration_date - Expiration date of the batch (nullable)
   * @param {number|string} data.user_id - ID of the user who created or manages this batch
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.supply_id = data.supply_id || null;
    this.stock = data.stock || 0;
    this.expiration_date = data.expiration_date || null;
    this.user_id = data.user_id || null;
  }
}
