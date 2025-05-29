import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierStateService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_ORDERS_TO_SUPPLIER_STATES_ENDPOINT_PATH);
    }


}