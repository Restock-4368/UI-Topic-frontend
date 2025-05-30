
export class Profile {
    constructor({
                    id = null,
                    name = '',
                    last_name = '',
                    username = '',
                    avatar = '',
                    phone = '',
                    address = '',
                    country = '',
                    description = '',
                    business_name = '',
                    business_address = '',
                    user_id = null
                } = {}) {
        this.id = id;
        this.name = name;
        this.last_name = last_name;
        this.username = username;
        this.avatar = avatar;
        this.phone = phone;
        this.address = address;
        this.country = country;
        this.description = description;
        this.businessName = business_name;
        this.businessAddress = business_address;
        this.userId = user_id;
    }
}

