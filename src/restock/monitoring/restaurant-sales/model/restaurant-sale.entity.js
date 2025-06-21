export class RestaurantSale {
    constructor({
        id,
        code,
        admin_restaurant_id,
        diner_name,
        total_price,
        date,
        added_inventory,
    }) {
        this.id = id;
        this.code = code;
        this.admin_restaurant_id = admin_restaurant_id;
        this.diner_name = diner_name;
        this.total_price = total_price;
        this.date = date;
        this.added_inventory = added_inventory;
    }
}

