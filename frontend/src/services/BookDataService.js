import http from "../http-common";

class BookDataService {
	async getAll(library) {
		return http.get(`/books/${library}/`);
	}

	async get(library, id) {
		return http.get(`/books/${library}/${id}`);
	}

	create(library, data) {
		return http.post(`/books/${library}/`, data);
	}

	update(library, id, data) {
		return http.put(`/books/${library}/${id}`, data);
	}

	delete(library, id) {
		return http.delete(`/books/${library}/${id}`);
	}

	deleteAll(library) {
		return http.delete(`/books/${library}/`);
	}


	async getInfos(book) {
		fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`, {
			method: "GET"
		}).then(response => {
			if (!response.ok) {
				return null
			} else {
				return response.json();
			}
		}).then(datas => {
			if (datas == null || datas.totalItems < 1) {
				console.error("Aucun résultat");
			} else {
				console.log(datas);
				book.title = "test"
			}
		}).catch(error => {
			console.error(error);
		});
	}
}

export default new BookDataService();