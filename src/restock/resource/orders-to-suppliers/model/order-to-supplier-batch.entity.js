export class OrderToSupplierBatch {
    constructor({ id = 0,
                    order_to_supplier_id = 0,
                    batch_id = 0,
                    quantity = 0,
                    accepted = false
                    }) {
        this.id = id;
        this.orderId = order_to_supplier_id;
        this.batchId = batch_id;
        this.quantity = quantity;
        this.accepted = accepted;
    }
}