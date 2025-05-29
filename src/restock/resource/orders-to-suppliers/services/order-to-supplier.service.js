import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_ORDERS_TO_SUPPLIER_ENDPOINT_PATH);
    }

    getBySupplierId(supplierId) {
        return this.getByQuery("supplierId", supplierId);
    }

    getByState(stateId) {
        return this.getByQuery("stateId", stateId);
    }

    approveOrder(orderId) {
        return httpInstance.patch(`${this.resourceEndpoint}/${orderId}/approve`);
    }

    getByRestaurantId(supplierId) {
        return this.getByQuery("supplierId", supplierId);
    }
}