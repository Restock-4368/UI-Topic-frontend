/**
 * @class UnitMeasurement
 * @description Represents a unit of measurement used for supplies (e.g., kg, liter, unit)
 */
export class UnitMeasurement {
  /**
   * Creates a new UnitMeasurement instance
   * @param {Object} params - The unit measurement initialization parameters
   * @param {string|number} [params.id=''] - Unique identifier for the unit of measurement
   * @param {string} [params.name=''] - Name of the unit (e.g., kg, liter)
   */
  constructor({ id = 0, name = '' } = {}) {
    /**
     * @type {string|number}
     * @description Unique identifier for the unit of measurement
     */
    this.id = id;

    /**
     * @type {string}
     * @description Name of the unit (e.g., kg, liter)
     */
    this.name = name;
  }
}
