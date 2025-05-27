import {BaseService} from "../../../shared/services/base.service.js";

export class ProfileService extends BaseService{
    constructor() {
        super(import.meta.env.VITE_PROFILE_ENDPOINT_PATH);
    }
}