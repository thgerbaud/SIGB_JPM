const db = require("../models");
const Book = db.books;

// Create and Save a new Book
exports.create = (req, res) => {
	// Validate request
	if (!req.body.isbn) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}

	fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${req.body.isbn}`, {
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
			return;
		} else {
			const infos = datas.items[0].volumeInfo;
			const id = datas.items[0].id;

			const book = new Book({
				isbn: req.body.isbn,
				code: req.body.code,
				location: req.body.location,
				title: infos.title,
				author: infos.authors,
				description: infos.description,
				image: `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
				publication: (new Date(infos.publishedDate)).toDateString()
			});

			book
				.save(book)
				.then(data => {
					res.send(data);
				})
				.catch(err => {
					res.status(500).send({
						message:
							err.message || "Some error occurred while creating the book."
					});
				});

		}
	}).catch(error => {
		console.error(error);
	});

};

// Retrieve all books from the database.
exports.findAll = (req, res) => {
	const isbn = req.query.isbn;
	var condition = isbn ? { isbn: isbn } : {};

	Book.find(condition)
		.then(books => {
			res.send(books);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving books."
			});
		});
};

// Find a single Book with an id
exports.findOne = (req, res) => {

};

// Update a Book by the id in the request
exports.update = (req, res) => {

};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Book from the database.
exports.deleteAll = (req, res) => {
	Book.deleteMany({})
	.then(() => {
		res.send("Books deleted");
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while deleting books."
		});
	});
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};