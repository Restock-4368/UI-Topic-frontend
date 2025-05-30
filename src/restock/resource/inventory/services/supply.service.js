import {BaseService} from "../../../../shared/services/base.service.js";
import {Supply} from "../model/supply.entity.js";


export class SupplyService extends BaseService {

    resourceEndpoint = import.meta.env.VITE_SUPPLIES_ENDPOINT_PATH;


}
