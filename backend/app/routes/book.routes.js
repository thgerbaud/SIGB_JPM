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

	/**
	 * Permet de récupérer les informations d'un livre.
	 * @param id id du livre
	 * @sortie livre
	 * @auth token necessaire, admin ou invite
	 * @status 200
	 */
	router.get("/:id", getTokenInfos, book.findOne);

	/**
	 * Permet de modifier un livre.
	 * @param id id du livre
	 * @entree paramètres à modifier {[code,] [location,] [category]}
	 * @sortie livre modifié
	 * @auth token necessaire, admin
	 * @status 200
	 */
	router.put("/:id", getTokenInfos, book.update);

	/**
	 * Permet de supprimer un livre.
	 * @param id id du livre
	 * @auth token necessaire, admin
	 * @status 204
	 */
	router.delete("/:id", getTokenInfos, book.delete);

	app.use('/api/books', router);
};