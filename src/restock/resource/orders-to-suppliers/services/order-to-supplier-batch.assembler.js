import {OrderToSupplierBatch} from "../model/order-to-supplier-batch.entity.js";

export class OrderToSupplierBatchAssembler {

    static toEntityFromResource(resource) {
        return new OrderToSupplierBatch(resource);
    }

    static toEntitiesFromResponse(response) {
        const orderSuppliesResponse = response.data;
        return orderSuppliesResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}