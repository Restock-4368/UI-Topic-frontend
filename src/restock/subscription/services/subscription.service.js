import { BaseService } from '../../../shared/services/base.service'

const subscriptionsResourceEndpointPath = import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH;

export class SubscriptionService extends BaseService {
    constructor() {
        super();
        this.resourceEndpoint = subscriptionsResourceEndpointPath;
    }
}