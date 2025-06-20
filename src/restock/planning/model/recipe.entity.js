export class Recipe {
    constructor({
        id,
        name,
        total_price,
        image_url,
        user_id
                }) {
        this.id = id;
        this.name = name;
        this.total_price = total_price;
        this.image_url = image_url;
        this.user_id = user_id;
    }
}