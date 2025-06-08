import {OrderToSupplierSupply} from "../model/order-to-supplier-supply.entity.js";

export class OrderToSupplierSupplyAssembler {

    static toEntityFromResource(resource) {
        return new OrderToSupplierSupply(resource);
    }

    static toEntitiesFromResponse(response) {
        const orderSuppliesResponse = response.data;
        return orderSuppliesResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}