import store from "@/store";

const BASE_URL = process.env.VUE_APP_BASE_URL_API + "books/";

class BookDataService {
	async getAll(library) {
		return await fetch(`/books/${library}/`);
	}

	/*async get(library, id) {
		return http.get(`/books/${library}/${id}`);
	}*/

	async create(data) {
		const book = await fetch(BASE_URL, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(async res => {
			if(res.status === 201) {
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

	/*update(library, id, data) {
		return http.put(`/books/${library}/${id}`, data);
	}*/

	/*delete(library, id) {
		return http.delete(`/books/${library}/${id}`);
	}*/

	/*deleteAll(library) {
		return http.delete(`/books/${library}/`);
	}*/
}

export default new BookDataService();