import { SupplyBatchService} from "./supply-batch.service.js";
import { SupplyService} from "./supply.service.js";
import { SupplyBatch} from "../model/supply-batch.entity.js";
import { SupplyBatchAssembler} from "./supply-batch.assembler.js";
import { BaseService} from "../../../../shared/services/base.service.js";

export class BatchService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_SUPPLY_BATCHES_ENDPOINT_PATH);
        this.supplyBatchService = new SupplyBatchService();
        this.supplyService = new SupplyService();
    }

    async getAllBatchesWithSupplies() {
        const [batchesResponse, suppliesResponse] = await Promise.all([
            this.supplyBatchService.getAll(),
            this.supplyService.getAll()
        ]);

        const rawBatches = batchesResponse.data;
        const supplies = suppliesResponse.data;

        return rawBatches.map(b => {
            const supply = supplies.find(s => s.id === b.supply_id);
            return {
                ...b,
                supply: supply ?? null
            };
        });
    }
}
