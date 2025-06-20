import {OrderToSupplierState} from "../model/order-to-supplier-state.vo.js";

export class OrderToSupplierStateAssembler {

    static toEntityFromResource(resource) {
        return new OrderToSupplierState(resource);
    }

    static toEntitiesFromResponse(response) {
        const orderStatesResponse = response.data;
        return orderStatesResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}