export class User {
    constructor({
        id = 0,
        name = "",
        email = "",
        avatar = "",
                }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
    }
}
