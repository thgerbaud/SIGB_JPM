import http from "../http-common";

class AuthService {
    async login(code){
        return http.post('/auth/login', {code: code});
    }
}

export default new AuthService();