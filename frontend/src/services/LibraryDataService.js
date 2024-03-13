import store from "@/store";

const BASE_URL = process.env.VUE_APP_BASE_URL_API + "libraries/";

class LibraryDataService {
	async getAll() {
		const libraries = await fetch(BASE_URL, {
			method: 'GET',
			headers: {
				"Authorization": store.getters.getToken,
			}
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//401 invalid credentials
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return libraries;
	}

	async getLibrary(id) {
		const library = await fetch(BASE_URL + id, {
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
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async getBooks(id) {
		const books = await fetch(BASE_URL + id + '/books', {
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
				//404 library not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return books;
	}

	async create(data) {
		const library = await fetch(BASE_URL, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(async res => {
			if (res.status === 201) {
				return res.json()
			} else {
				//400 name missing
				//401 invalide credentials
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async addAdmin(id, adminEmail) {
		const library = await fetch(BASE_URL + `${id}/admins`, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email: adminEmail })
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters/already exists
				//401 invalid credentials
				//403 access denied
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async deleteAdmin(id, adminId) {
		const library = await fetch(BASE_URL + `${id}/admins/${adminId}`, {
			method: 'DELETE',
			headers: {
				"Authorization": store.getters.getToken,
			}
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 already exists
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async addGuest(id, guestEmail) {
		const library = await fetch(BASE_URL + `${id}/users`, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email: guestEmail })
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 already exists
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async deleteGuest(id, guestId) {
		const library = await fetch(BASE_URL + `${id}/users/${guestId}`, {
			method: 'DELETE',
			headers: {
				"Authorization": store.getters.getToken,
			}
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async addLocation(id, name) {
		const library = await fetch(BASE_URL + `${id}/locations`, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify({ name })
		}).then(async res => {
			if (res.status === 201) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 duplicate location name
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async editLocation(id, locationId, name) {
		const library = await fetch(BASE_URL + `${id}/locations/${locationId}`, {
			method: 'PUT',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify({ name })
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 duplicate location name
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async deleteLocation(id, locationId) {
		const library = await fetch(BASE_URL + `${id}/locations/${locationId}`, {
			method: 'DELETE',
			headers: {
				"Authorization": store.getters.getToken,
			}
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async addCategory(id, name, parent = undefined) {
		const library = await fetch(BASE_URL + `${id}/categories`, {
			method: 'POST',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify((parent) ? { name, parent } : { name })
		}).then(async res => {
			if (res.status === 201) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 duplicate category name
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async editCategory(id, categoryId, name) {
		const library = await fetch(BASE_URL + `${id}/categories/${categoryId}`, {
			method: 'PUT',
			headers: {
				"Authorization": store.getters.getToken,
				"Content-type": "application/json"
			},
			body: JSON.stringify({ name })
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//409 duplicate category name
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

	async deleteCategory(id, categoryId) {
		const library = await fetch(BASE_URL + `${id}/categories/${categoryId}`, {
			method: 'DELETE',
			headers: {
				"Authorization": store.getters.getToken,
			},
		}).then(async res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return library;
	}

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
				//400 invalid parameters
				//401 invalid credentials
				//403 access denied
				//404 not found
				//500 internal error
				const message = await res.text();
				throw new Error(`[${res.status.toString()}] ${message}`);
			}
		}).catch(err => {
			throw err;
		});

		return;
	}

}

export default new LibraryDataService();