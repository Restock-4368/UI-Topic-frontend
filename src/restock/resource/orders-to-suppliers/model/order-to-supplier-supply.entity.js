export class OrderToSupplierSupply {
    constructor({ order_to_supplier_id = 0, supply_id = 0, quantity = '', accepted = '' }) {
        this.orderId = order_to_supplier_id;
        this.supplyId = supply_id;
        this.quantity = quantity;
        this.accepted = accepted;
    }
}