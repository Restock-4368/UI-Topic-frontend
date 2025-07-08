export class RecipeSupply {
    constructor(data) {
        this.id = data.id;
        this.recipe_id = data.recipe_id;
        this.supply_id = data.supply_id;
        this.quantity = data.quantity;
    }

    getQuantityLabel() {
        return `${this.quantity} unit(s)`;
    }
}
