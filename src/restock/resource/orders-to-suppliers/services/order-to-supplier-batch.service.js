import { BaseService } from "../../../../shared/services/base.service.js";

export class OrderToSupplierBatchService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_ORDERS_TO_SUPPLIER_SUPPLIES_ENDPOINT_PATH;

    getByOrderId(orderId) {
        return this.getByQuery("order_to_supplier_id", orderId);
    }

    getByBatchId(batchId) {
        return this.getByQuery("batch_id", batchId);
    }

}