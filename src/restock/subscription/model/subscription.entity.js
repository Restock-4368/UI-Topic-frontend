export class Subscription {
    constructor({
        id,
        name,
        duration,
        price,
        status,
        popular,
        features,
        rol_id
    }
    ) {

        this.id = id;
        this.name = name;
        this.duration = duration;
        this.price = price;
        this.status = status;
        this.popular = popular;
        this.features = features;
        this.rol_id = rol_id;
    }
}