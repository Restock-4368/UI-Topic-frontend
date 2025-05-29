export class OrderToSupplierSupply {
    constructor({ order_to_supplier_id, supply_id, stock, accepted }) {
        this.orderId = order_to_supplier_id;
        this.supplyId = supply_id;
        this.stock = stock;
        this.accepted = accepted;
    }
}