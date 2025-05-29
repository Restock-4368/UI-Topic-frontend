import { BaseService } from "src/shared/services/base.service.js";

export class OrderToSupplierStateService extends BaseService {
    constructor() {
        super("/orders-to-supplier-states");
    }

}