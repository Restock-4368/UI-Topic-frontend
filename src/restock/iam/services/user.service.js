import axios from 'axios';
import { User } from '../model/user.entity.js';
import { BaseService } from "../../../shared/services/base.service.js";

export class UserService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_USERS_ENDPOINT_PATH);
        this.roles = [
            { id: 1, name: 'supplier' },
            { id: 2, name: 'restaurant' }
        ]; // Aquí puedes cargar los roles dinámicamente si es necesario
    }

    async getAll() {
        const response = await super.getAll();
        return response.data.map(User.fromPersistence);
    }

    async getById(id) {
        const response = await super.getById(id);
        const user = User.fromPersistence(response.data);
        // Ahora asignamos el nombre del rol según el role_id
        user.role = this.getRoleName(user.roleId);
        return user;
    }

    getRoleName(roleId) {
        const role = this.roles.find(role => role.id === roleId);
        return role ? role.name : 'unknown';
    }
}
