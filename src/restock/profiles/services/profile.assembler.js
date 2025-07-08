import {Profile} from "../model/profile.entity.js";

export class ProfileAssembler {

    static toEntityFromResource(resource) {

        const [first_name, ...lastParts] = (resource.full_name || '').split(" ");
        const last_name = lastParts.join(" ");

        const mappedResource = {
            id: resource.id,
            first_name: first_name,
            last_name: last_name,
            email: resource.email,
            avatar: resource.avatar,
            phone: resource.phone,
            address: resource.address,
            country: resource.country,
            business_id: resource.business_id,
            user_id: resource.user_id,
            business: resource.business,
            user: resource.user
        };

        return new Profile(mappedResource);
    }

    static toEntitiesFromResponse(response) {
        const profilesResponse = response.data;
        return profilesResponse.map((profile) => {
            return this.toEntityFromResource(profile);
        });
    }
}