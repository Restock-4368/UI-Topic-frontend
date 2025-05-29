import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierSupplyService extends BaseService {
    constructor() {
        super("/orders-to-supplier-supplies");
    }

    getByOrderId(orderId) {
        return this.getByQuery("order_to_supplier_id", orderId);
    }

    updateAcceptance(orderId, supplyId, accepted) {
        return httpInstance.patch(`${this.resourceEndpoint}`, {
            order_to_supplier_id: orderId,
            supply_id: supplyId,
            accepted
        });
    }

    getBySupplyId(supplyId) {
        return this.getByQuery("supply_id", supplyId);
    }
}