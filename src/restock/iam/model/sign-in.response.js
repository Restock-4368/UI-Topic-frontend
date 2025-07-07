/**
 * Sign In Response
 * @summary
 * Represents a sign-in response. This is used to authenticate a user.
 */
export class SignInResponse {
    /**
     * Constructor
     * @param {int} id The id of the user.
     * @param {string} username The username of the user.
     * @param {number} roleId The username of the user.
     * @param {string} token The token generated for the user.
     */
    constructor(id, username, roleId, token) {
        this.id = id;
        this.username = username;
        this.role_id = roleId;
        this.token = token;
    }
}