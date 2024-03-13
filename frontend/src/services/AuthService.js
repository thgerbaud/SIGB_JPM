const BASE_AUTH_URL = process.env.VUE_APP_BASE_URL_API + "auth/"

/**
 * Permet de se connecter.
 * @param {String} code code d'autorisation fourni par Google
 * @returns {Promise<Object>} jeton d'authentification et informations de l'utilisateur
 * @throws
 */
export async function login(code) {
    const data = fetch(BASE_AUTH_URL + "login", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ code: code })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Authentification failed.')
        }
        return response.json();
    }).catch(err => {
        throw err;
    });
    return data;
}
