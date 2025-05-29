export class OrderToSupplier {
    constructor({
                    id,
                    date,
                    admin_restaurant_id,
                    supplier_id,
                    order_to_supplier_state_id,
                    order_to_supplier_situation_id,
                    total_price,
                    partially_accepted
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
