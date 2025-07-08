
export class Profile {
    constructor({
                    id = 0,
                    first_name = '',
                    email = '',
                    last_name = '',
                    avatar = '',
                    phone = '',
                    address = '',
                    country = '',
                    business_id = 0,
                    user_id = 0,
                    business = null,
                    user = null,
                } = {}) {
        this.id = id;
        this.name = first_name;
        this.email = email;
        this.last_name = last_name;
        this.avatar = avatar;
        this.phone = phone;
        this.address = address;
        this.country = country;
        this.business_id = business_id;
        this.user_id = user_id;
        this.business = business;
        this.user = user;
    }
}

