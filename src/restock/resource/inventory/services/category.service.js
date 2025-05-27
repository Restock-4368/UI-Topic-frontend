import {BaseService} from "../../../../shared/services/base.service.js";
import {Category} from "../model/category.entity.js";


export class CategoryService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_CATEGORIES_ENDPOINT_PATH); // e.g. '/categories'
    }

    async getAll() {
        const response = await super.getAll();
        return response.data.map(c => new Category(c));
    }
}
