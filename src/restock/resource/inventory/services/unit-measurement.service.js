import {BaseService} from "../../../../shared/services/base.service.js";
import {UnitMeasurement} from "../model/unit-measurement.entity.js";

export class UnitMeasurementService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_UNITS_MEASUREMENT_ENDPOINT_PATH); // e.g. '/unit_measurements'
    }

    // async getAll() {
    //     const response = await super.getAll();
    //     return response.data.map(u => new UnitMeasurement(u));
    // }
}
