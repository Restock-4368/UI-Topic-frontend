export class Supply {
    constructor({
                    id = 0,
                    description = '',
                    perishable = false,
                    min_stock = 0,
                    max_stock = 0,
                    category_id = 0,
                    unit_measurement_id = 0,
                    price = 0.0,
                    user_id = 0,
                }) {
        this.id = id;
        this.description = description;
        this.perishable = perishable;
        this.min_stock = min_stock;
        this.max_stock = max_stock;
        this.category_id = category_id;
        this.unit_measurement_id = unit_measurement_id;
        this.price = price;
        this.user_id = user_id;
    }
}
