export class Supply {
    constructor({
                    id,
                    description,
                    perishable,
                    min_stock,
                    max_stock,
                    category_id,
                    unit_measurement_id,
                    price,
                    user_id,
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
