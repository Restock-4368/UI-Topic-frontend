import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierSupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_ORDERS_TO_SUPPLIER_SUPPLIES_ENDPOINT_PATH;

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