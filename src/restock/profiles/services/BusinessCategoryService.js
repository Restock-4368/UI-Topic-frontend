import {BaseService} from "../../../shared/services/base.service.js";

export class BusinessCategoryService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_BUSINESS_CATEGORIES_ENDPOINT_PATH);
    }
}