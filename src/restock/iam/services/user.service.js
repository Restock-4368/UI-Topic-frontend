import axios from 'axios';
import { User } from '../model/user.entity.js';
import {BaseService} from "../../../shared/services/base.service.js";

const API_URL = import.meta.env.VITE_API_URL;

export class UserService extends BaseService{

    resourceEndpoint = import.meta.env.VITE_USERS_ENDPOINT_PATH;

    /**
     * Obtiene un usuario por ID
     * @param {number} id - ID del usuario a obtener
     * @returns {Promise<User>}
     */
    async getUserById(id) {
        return axios.get(`${API_URL}/users/${id}`).then(res => new User(res.data));
    }

    /**
     * Obtiene todos los usuarios (por si necesitas la lista luego)
     * @returns {Promise<User[]>}
     */
    async getAllUsers() {
        try {
            const { data } = await axios.get(`${API_URL}/users`);
            return data.map(user => new User(user));
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }
}
