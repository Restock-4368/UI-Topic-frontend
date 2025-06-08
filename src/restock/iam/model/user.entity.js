
export class User {
    constructor({
                    id = 0,
                    email = '',
                    password = '',
                    subscription_id = 0,
                    start_date = new Date(),
                    subscription_payment_details_id = 0,
                    role_id = 0
                }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.subscriptionId = subscription_id;
        this.startDate = start_date;
        this.subscriptionPaymentDetailsId = subscription_payment_details_id;
        this.roleId = role_id;
    }

    static fromPersistence(raw) {
        return new User({
            id: raw.id,
            email: raw.email,
            password: raw.password,
            subscription_id: raw.subscription_id,
            start_date: raw.start_date,
            subscription_payment_details_id: raw.subscription_payment_details_id,
            role_id: raw.role_id
        });
    }

    static fromForm(data) {
        return new User({
            email: data.email,
            password: data.password,
            subscription_id: data.subscription_id,
            start_date: data.start_date,
            subscription_payment_details_id: data.subscription_payment_details_id,
            role_id: data.role_id
        });
    }
}
