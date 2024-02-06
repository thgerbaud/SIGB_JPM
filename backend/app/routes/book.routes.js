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
	 * @entree paramètres à modifier {category}
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

	/**
	 * Permet d'ajouter un exemplaire d'un livre.
	 * @param id id du livre
	 * @entree paramètres de l'exemplaire {code, [location]}
	 * @sortie livre mis à jour
	 * @auth token necessaire, admin
	 * @status 201
	 */
	router.post("/:id/copies/", getTokenInfos, book.createCopy);

	/**
	 * Permet de modifier un exemplaire d'un livre.
	 * @param id id du livre
	 * @param copyId id de l'exemplaire
	 * @entree paramètres à modifier {[code,] [locatino]}
	 * @sortie livre mis à jour
	 * @auth token necessaire, admin
	 * @status 200
	 */
	router.put("/:id/copies/:copyId", getTokenInfos, book.updateCopy);

	/**
	 * Permet de supprimer un exemplaire d'un livre.
	 * Supprime le livre s'il s'agit du dernier exemplaire.
	 * @param id id du livre
	 * @param copyId id de l'exemplaire
	 * @sortie livre mis à jour s'il reste au moins un exemplaire
	 * @status 200/204
	 */
	router.delete("/:id/copies/:copyId", getTokenInfos, book.deleteCopy);

	app.use('/api/books', router);
};