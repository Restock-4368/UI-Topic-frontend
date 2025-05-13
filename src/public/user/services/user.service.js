// user.service.js
import axios from 'axios'

export class UserService {
    getUser(id) {
        return axios.get(`http://localhost:3000/users/${id}`)
    }
}
