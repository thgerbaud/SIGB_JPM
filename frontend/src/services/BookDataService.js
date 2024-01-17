import store from "@/store";

const BASE_URL = process.env.VUE_APP_BASE_URL_API + "books/";

class BookDataService {

	/**
	 * Permet de récupérer un livre.
	 * @param {String} id id du livre
	 * @returns {Promise<Object>} livre correspondant
	 * @throws code http et message de la réponse en cas d'échec
	 */
	async get(id) {
		const book = await fetch(BASE_URL + id, {
			method: 'GET',
			headers: {
				"Authorization": store.getters.getToken,
			}
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//401 invalid credentials
				//403 access denied
				//404 book not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return book;
	}

	/**
	 * Permet de créer un livre.
	 * @param {Object} data n°ISBN, code, emplacement et catégorie du livre
	 * @returns {Promise<Object>} livre créé
	 * @throws code http et message de la réponse en cas d'échec
	 */
	async create(data) {
		const book = await fetch(BASE_URL, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(async res => {
			if (res.status === 201) {
				return res.json();
			} else {
				//400 invalid/missing field
				//401 invalide credentials
				//403 unauthorized
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			console.error(err);
			throw err;
		});

		return book;
	}

	/**
	 * Permet de modifier un livre.
	 * @param {String} id id du livre à modifier
	 * @param {Object} data paramètres à modifier
	 * @returns {Promise<Object>} livre modifier
	 * @throws code http et message de la réponse en cas d'échec
	 */
	async update(id, data) {
		const book = await fetch(BASE_URL + id, {
			method: 'PUT',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid field
				//401 invalide credentials
				//403 unauthorized
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			console.error(err);
			throw err;
		});

		return book;
	}

	/**
	 * Permet de supprimer un livre.
	 * @param {String} id id du livre à supprimer
	 * @returns {Promise<void>}
	 * @throws code http et message de la réponse en cas d'échec
	 */
	async delete(id) {
		await fetch(BASE_URL + id, {
			method: 'DELETE',
			headers: {
				"Authorization": store.getters.getToken,
			},
		}).then(async res => {
			if (res.status === 204) {
				return;
			} else {
				//400 invalid field
				//401 invalide credentials
				//403 unauthorized
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			console.error(err);
			throw err;
		});
	}
}

export default new BookDataService();