const { getTokenInfos } = require("../controllers/auth.controller.js");

module.exports = app => {
	const book = require("../controllers/book.controller.js");

	var router = require("express").Router();

	/**
	 * Permer de créer un nouveau livre.
	 * @entree {isbn, code, location, categorie, bibliotheque}
	 * @sortie livre créé
	 * @auth token necessaire, admin
	 * @status 201
	 */
	router.post("/", getTokenInfos, book.create);

	// Retrieve all book
	router.get("/:library/", book.findAll);


	// Retrieve a single book with code
	router.get("/:library/:code", book.findOne);

	// Update a book with code
	router.put("/:library/:code", book.update);

	// Delete a book with code
	router.delete("/:library/:code", book.delete);

	// Delete all books
	router.delete("/:library/", book.deleteAll);

	app.use('/api/books', router);
};