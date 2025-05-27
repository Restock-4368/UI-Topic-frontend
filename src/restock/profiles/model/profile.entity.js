class Profile {
    constructor() {
        this.name = 'Elon';
        this.lastName = 'Musk';
        this.email = 'elon@gmail.com';
        this.phone = '+51 940 163 699';
        this.address = 'Av. Paseo de la República cuadra 2 ';
        this.country = 'Peru';
        this.description = 'I am a restaurant manager passionate about delivering exceptional culinary experiences.';
        this.companyName = 'Alimentos S.A.';
        this.companyAddress = 'Av. Paseo de la República cuadra 3';
        this.companyCategories = ['Fast Food', 'Beverages', 'Desserts', 'Grill', 'Pizzeria', 'Buffet'];
        this.image = 'assets/admin-avatar.png';
    }
}

const profile = new Profile();
console.log(profile.name); // "Elon"
