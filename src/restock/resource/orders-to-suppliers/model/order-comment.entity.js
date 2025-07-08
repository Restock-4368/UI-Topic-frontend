export class OrderComment {
    constructor({
                    id = 0,
                    order_to_supplier_id = 0,
                    content = '',
                    rating = 0,
                    date = new Date()
                }) {
        this.id = id;
        this.order_to_supplier_id = order_to_supplier_id;
        this.content = content;
        this.rating = rating;
        this.date = new Date(date);
    }
}
