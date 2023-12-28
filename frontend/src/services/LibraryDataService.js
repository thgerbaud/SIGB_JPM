import store from "@/store";

const BASE_URL = process.env.VUE_APP_BASE_URL_API + "libraries/";
const HEADERS = {
	"Authorization": store.getters.getToken,
	"Content-type": "application/json"
}

class LibraryDataService {
	async getAll() {
		const libraries = await fetch(BASE_URL, {
			method: 'GET',
			headers: HEADERS
		}).then(res => {
			if (res.status === 200) {
				return res.json();
			} else {
				//401 invalid credentials
				//500 internal error
				throw new Error(res.status.toString());
			}
		}).catch(err => {
			throw err;
		});

		return libraries;
	}

	//getLibrary(id) {}

	async create(data) {
		const library = await fetch(BASE_URL, {
			method: 'POST',
			headers: HEADERS,
			body: data
		}).then(res => {
			if (res.status === 201) {
				return res.json()
			} else {
				//400 name missing
				//401 invalide credentials
				//500 internal error
				throw new Error(res.status.toString());
			}
		}).catch(err => {
			console.error(err);
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