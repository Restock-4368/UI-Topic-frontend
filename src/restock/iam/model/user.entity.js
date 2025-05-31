
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
}
