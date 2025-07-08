/**
 * @class SupplyCategory
 * @description Represents a supply category entity used for organizing supplies
 * Typically used in inventory or supply management systems
 */
export class SupplyCategory {
    /**
     * Creates a new SupplyCategory instance
     * @param {Object} params - The supply category initialization parameters
     * @param {string} [params.id=''] - Unique identifier for the supply category
     * @param {string} [params.name=''] - Display name of the supply category
     */
    constructor({id = '', name = ''} = {}){
        /**
         * @type {string}
         * @description Unique identifier for the supply category
         */
        this.id = id;
        
        /**
         * @type {string}
         * @description Display name of the supply category
         */
        this.name = name;
    }
}
