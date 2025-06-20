import {Business} from "../model/business.entity.js";

export class BusinessAssembler {

    static toEntityFromResource(resource) {
        return new Business(resource);
    }

    static toEntitiesFromResponse(response) {
        const businessResponse = response.data;
        return businessResponse.map((order) => {
            return this.toEntityFromResource(order);
        });
    }
}