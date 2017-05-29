export default class Auth {

    static authenticateUser(token) {
        window.localStorage.setItem('token', token);
    }

    static getAuthenticatedToken()  {
        return window.localStorage.getItem("token");
    }

    static isUserAuthenticated() {
        return window.localStorage.getItem('token') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
    }
}

