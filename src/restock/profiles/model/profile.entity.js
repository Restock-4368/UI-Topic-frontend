export class Profile {
    constructor({
                    id = null,
                    last_name = '',
                    phone = '',
                    address = '',
                    country = '',
                    description = '',
                    companyName = '',
                    companyAddress = '',
                    companyCategories = [],
                    user_id = null
                } = {}) {
        this.id = id;
        this.last_name = last_name;
        this.phone = phone;
        this.address = address;
        this.country = country;
        this.description = description;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.companyCategories = companyCategories;
        this.user_id = user_id;
    }
}
