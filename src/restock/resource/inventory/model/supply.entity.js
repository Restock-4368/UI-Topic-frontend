/**
 * @class Supply
 * @description Represents a supply item used in inventory management
 */
export class Supply {
  /**
   * Creates a new Supply instance
   * @param {Object} params - The supply initialization parameters
   * @param {number|string} [params.id=''] - Unique identifier for the supply
   * @param {string} [params.name=''] - Name of the supply item
   * @param {string} [params.description=''] - Description or details of the supply item
   * @param {boolean} [params.perishable=false] - Indicates if the supply is perishable
   * @param {number} [params.min_stock=0] - Minimum stock level
   * @param {number} [params.max_stock=0] - Maximum stock level
   * @param {number|string} [params.category_id=''] - ID of the associated supply category
   * @param {number|string} [params.unit_measurement_id=''] - ID of the unit of measurement
   * @param {number} [params.price=0] - Price of the supply
   * @param {number|string} [params.user_id=''] - ID of the user who created or manages this supply
   */
  constructor({
    id = '',
    name = '',
    description = '',
    perishable = false,
    min_stock = 0,
    max_stock = 0,
    category_id = '',
    unit_measurement_id = '',
    price = 0,
    user_id = '',
  } = {}) {
    /** @type {number|string} */
    this.id = id;

    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.description = description;

    /** @type {boolean} */
    this.perishable = perishable;

    /** @type {number} */
    this.min_stock = min_stock;

    /** @type {number} */
    this.max_stock = max_stock;

    /** @type {number|string} */
    this.category_id = category_id;

    /** @type {number|string} */
    this.unit_measurement_id = unit_measurement_id;

    /** @type {number} */
    this.price = price;

    /** @type {number|string} */
    this.user_id = user_id;
  }
}
