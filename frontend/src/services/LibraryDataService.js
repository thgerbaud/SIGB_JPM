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
			if(res.status === 200) {
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
			if(res.status === 200) {
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

	//updateSettings(id, data) {}

	//addAdmin(id, newAdmin) {}

	//addUser(id, newUser) {}

	//deleteUser(id, user) {}

	//delete(id) {}

}

export default new LibraryDataService();