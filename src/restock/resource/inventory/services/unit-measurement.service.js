import {BaseService} from "../../../../shared/services/base.service.js";
import {UnitMeasurement} from "../model/unit-measurement.entity.js";
import httpInstance from "../../../../shared/services/http.instance.js";

/**
 * @class UnitMeasurementService
 * @description Service class for handling CRUD operations on units of measurement
 */
export class UnitMeasurementService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_UNITS_MEASUREMENT_ENDPOINT_PATH;

    /**
     * Retrieves units of measurement by name
     * @param {string} name - The name to search for (e.g., "kg")
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching units
     */
    getByName(name) {
        return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
    }

    // async getAll() {
    //     const response = await super.getAll();
    //     return response.data.map(u => new UnitMeasurement(u));
    // }
}
