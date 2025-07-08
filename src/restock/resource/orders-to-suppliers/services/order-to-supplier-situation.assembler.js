import {OrderToSupplierSituation} from "../model/order-to-supplier-situation.vo.js";

export class OrderToSupplierSituationAssembler {

    static toEntityFromResource(resource) {
        return new OrderToSupplierSituation(resource);
    }

    static toEntitiesFromResponse(response) {
        const orderSituationsResponse = response.data;
        return orderSituationsResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}