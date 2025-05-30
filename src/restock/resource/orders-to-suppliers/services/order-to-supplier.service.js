import { BaseService } from "../../../../shared/services/base.service.js";

export class OrderToSupplierService extends BaseService {
    resourceEndpoint = import.meta.env.VITE_ORDERS_TO_SUPPLIER_ENDPOINT_PATH;

    getBySupplierId(supplierId) {
        return this.getByQuery("supplierId", supplierId);
    }

    getByState(stateId) {
        return this.getByQuery("stateId", stateId);
    }

    getByRestaurantId(supplierId) {
        return this.getByQuery("supplierId", supplierId);
    }
}