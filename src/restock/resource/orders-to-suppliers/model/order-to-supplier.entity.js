export class OrderToSupplier {
    constructor({
                    id = 0,
                    date = new Date(),
                    admin_restaurant_id = 0,
                    supplier_id = 0,
                    order_to_supplier_state_id = 0,
                    order_to_supplier_situation_id = 0,
                    total_price = 0.0,
                    partially_accepted = false
                }) {
        this.id = id;
        this.date = date;
        this.adminRestaurantId = admin_restaurant_id;
        this.supplierId = supplier_id;
        this.stateId = order_to_supplier_state_id;
        this.situationId = order_to_supplier_situation_id;
        this.totalPrice = total_price;
        this.partiallyAccepted = partially_accepted;
    }
}
