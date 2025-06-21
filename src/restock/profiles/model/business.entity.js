export class Business {

    constructor({
                    id = 0,
                    name = '',
                    address = '',
                    categories = '',
                    email = '',
                    phone = ''
                }) {
        this.id = id || 0;
        this.name = name || '';
        this.email = email || '';
        this.phone = phone ||'';
        this.address = address || '';
        this.categories = categories || '';
    }
}
