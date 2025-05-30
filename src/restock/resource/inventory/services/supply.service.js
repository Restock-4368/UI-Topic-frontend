import {BaseService} from "../../../../shared/services/base.service.js";
import {Supply} from "../model/supply.entity.js";


export class SupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_SUPPLIES_ENDPOINT_PATH;

    async getAll() {
        const response = await super.getAll();
        return response.data.map(s => new Supply(s));
    }

    async getById(id) {
        const response = await super.getById(id);
        return new Supply(response.data);
    }

    async create(supplyData) {
        const response = await super.create(supplyData);
        return new Supply(response.data);
    }

    async update(id, supplyData) {
        const response = await super.update(id, supplyData);
        return new Supply(response.data);
    }

    async delete(id) {
        return await super.delete(id);
    }
}
