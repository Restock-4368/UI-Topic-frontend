
import {OrderToSupplier} from "/src/restock/resource/orders-to-suppliers/model/order-to-supplier.entity.js";

export class OrderToSupplierAssembler {

    static toEntityFromResource(resource) {
        return new OrderToSupplier(resource);
    }

    static toEntitiesFromResponse(response) {
        const ordersResponse = response.data;
        return ordersResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}