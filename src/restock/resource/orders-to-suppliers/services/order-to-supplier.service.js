import { BaseService } from "../../../../shared/services/base.service.js";
import {OrderToSupplierAssembler} from "./order-to-supplier.assembler.js";

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

    getByRestaurantId(restaurantId) {
        return this.getByQuery("admin_restaurant_id", restaurantId);
    }
}

export async function getOrdersToSupplierFromRestaurant() {
    const service = new OrderToSupplierService();
    const restaurantId = 2;
    const response = await service.getByRestaurantId(restaurantId);
    return OrderToSupplierAssembler.toEntitiesFromResponse(response);
}