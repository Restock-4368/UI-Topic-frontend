import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierSituationService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_ORDERS_TO_SUPPLIER_SITUATIONS_ENDPOINT_PATH);
    }

}