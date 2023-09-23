import http from "../http-common";

class BookDataService {
	async getAll() {
		return http.get("/books");
	}

	get(id) {
		return http.get(`/books/${id}`);
	}

	create(data) {
		return http.post("/books", data);
	}

	update(id, data) {
		return http.put(`/books/${id}`, data);
	}

	delete(id) {
		return http.delete(`/books/${id}`);
	}

	deleteAll() {
		return http.delete(`/books`);
	}

	findByTitle(title) {
		return http.get(`/books?title=${title}`);
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