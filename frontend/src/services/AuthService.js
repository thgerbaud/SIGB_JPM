const BASE_AUTH_URL = process.env.VUE_APP_BASE_URL_API + "auth/"

class AuthService {
    async login(code){
        const data = fetch(BASE_AUTH_URL + "login", {
            method: 'POST',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({code: code})
        }).then(response => {
            if(!response.ok) {
                return null // TODO
            }
            return response.json();
        }).catch(err => {
            console.error(err);
        });
        return data;
    }
}

export default new AuthService();