import {BaseService} from "../../../../shared/services/base.service.js";
import {OrderToSupplierAssembler} from "./order-to-supplier.assembler.js";
import {OrderToSupplierStateService} from "./order-to-supplier-state.service.js";
import {OrderToSupplierSituationService} from "./order-to-supplier-situation.service.js";
import {UserService} from "../../../iam/services/user.service.js";
import {ProfileService} from "../../../profiles/services/profile.service.js";

export class OrderToSupplierService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_ORDERS_TO_SUPPLIER_ENDPOINT_PATH);
    }

    getBySupplierId(supplierId) {
        return this.getByQuery("supplierId", supplierId);
    }

    getByState(stateId) {
        return this.getByQuery("stateId", stateId);
    }

    getByRestaurantId(restaurantId) {
        return this.getByQuery("admin_restaurant_id", restaurantId);
    }

    async getAllEnriched() {
        const [orders, states, situations, users] = await Promise.all([
            this.getAll(),
            new OrderToSupplierStateService().getAll(),
            new OrderToSupplierSituationService().getAll(),
            new UserService().getAll()
        ]);

        const profileService = new ProfileService();

        return await Promise.all(
            orders.map(async (order) => {
                const state = states.find(s => s.id === order.state_id);
                const situation = situations.find(s => s.id === order.situation_id);
                const supplierUser = users.find(u => u.id === order.supplier_id);
                const restaurantUser = users.find(u => u.id === order.admin_restaurant_id);

                const supplierProfile = supplierUser
                    ? await profileService.getByQuery("user_id", supplierUser.id).then(p => p[0])
                    : null;

                const restaurantProfile = restaurantUser
                    ? await profileService.getByQuery("user_id", restaurantUser.id).then(p => p[0])
                    : null;

                return {
                    ...order,
                    state,
                    situation,
                    supplierProfile,
                    restaurantProfile
                };
            })
        );
    }
}

export async function getOrdersToSupplierFromRestaurant() {
    const service = new OrderToSupplierService();
    const restaurantId = 4;
    const response = await service.getByRestaurantId(restaurantId);
    return OrderToSupplierAssembler.toEntitiesFromResponse(response);
}