
export class User {
    constructor({
        id = null,
        name = '',
        email = '',
        username = '',
        password = '',
        subscription_id = null,
        start_date = null,
        subscription_payment_details_id = null,
        avatar = {},
        role_id = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.subscriptionId = subscription_id;
        this.startDate = start_date;
        this.subscriptionPaymentDetailsId = subscription_payment_details_id;
        this.avatar = new Avatar(avatar);
        this.roleId = role_id;
    }

    static fromPersistence(raw) {
        return new User({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            username: raw.username,
            password: raw.password,
            subscription_id: raw.subscription_id,
            start_date: raw.start_date,
            subscription_payment_details_id: raw.subscription_payment_details_id,
            avatar: raw.avatar,
            role_id: raw.role_id
        });
    }

    static fromForm(data) {
        return new User({
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
            subscription_id: data.subscription_id,
            start_date: data.start_date,
            subscription_payment_details_id: data.subscription_payment_details_id,
            avatar: data.avatar,
            role_id: data.role_id
        });
    }
}

