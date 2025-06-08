import {User} from "../model/user.entity.js";

export class UserAssembler {

    static toEntityFromResource(resource) {
        return new User(resource);
    }

    static toEntitiesFromResponse(response) {
        const usersResponse = response.data;
        return usersResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}