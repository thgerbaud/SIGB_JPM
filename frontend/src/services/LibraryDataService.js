import http from "../http-common";

class LibraryDataService {
	async getAll(user_id) {
		return http.get(`/libraries/${user_id}`);
	}

	getLibrary(user_id, id) {
		return http.get(`/libraries/${user_id}/${id}`);
	}

	create(user_id, data) {
		return http.post(`/libraries/${user_id}`, data);
	}

	update(user_id, id, data) {
		return http.put(`/libraries/${user_id}/${id}`, data);
	}

	delete(user_id, id) {
		return http.delete(`/libraries/${user_id}/${id}`);
	}

	deleteAll(user_id) {
		return http.delete(`/libraries/${user_id}`);
	}

}

export default new LibraryDataService();