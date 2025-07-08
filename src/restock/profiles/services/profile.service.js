import {BaseService} from "../../../shared/services/base.service.js";

export class ProfileService extends BaseService{

    resourceEndpoint = import.meta.env.VITE_PROFILES_ENDPOINT_PATH;

    getByProfileId(profileId) {
        return this.getByQuery("profileId", profileId);
    }
}