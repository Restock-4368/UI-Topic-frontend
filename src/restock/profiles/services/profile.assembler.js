import {Profile} from "../model/profile.entity.js";

export class ProfileAssembler {

    static toEntityFromResource(resource) {
        return new Profile(resource);
    }

    static toEntitiesFromResponse(response) {
        const profilesResponse = response.data;
        return profilesResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}