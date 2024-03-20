const { body, param, validationResult } = require('express-validator');
const { getTokenInfos } = require("../controllers/auth.controller.js");
const book = require("../controllers/book.controller.js");

const CODE_REGEX = /^[A-Z0-9]+$/;
const MAX_CODE_LENGTH = 10;

function handleValidationResult(req, res, next) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).send({ errors: result.formatWith(error => error.msg).array() });
	} else {
		next();
	}
}

module.exports = app => {

	const router = require("express").Router();

	/**
	 * Permet de créer un nouveau livre.
	 * @sortie livre créé
	 * @auth token nécessaire, admin
	 * @status 201
	 */
	router.post("/",
		getTokenInfos,
		body('library').isMongoId().withMessage('Missing or invalid library id.'),
		body('isbn').isISBN().withMessage('Missing or invalid isbn.'),
		body('categories').optional().isArray().withMessage('Invalid categories array.'),
		body('categories.*').isMongoId().withMessage('Invalid category id.'),
		body('copies').isArray({ min: 1 }).withMessage('Invalid copies array. At least one copy is needed'),
		body('copies.*').isObject().withMessage('Invalid copy in copies.'),
		body('copies.*.code').isString().bail().withMessage('Missing or invalid code in copies.')
			.trim().toUpperCase()
			.isLength({ min: 1, max: MAX_CODE_LENGTH }).withMessage('Invalid code in copies : code must be between 1 and 10 caracters long.')
			.matches(CODE_REGEX).withMessage('Invalid code in copies : only letters, numbers and hyphens are allowed.'),
		body('copies.*.location').optional({ values: 'null' }).isMongoId().withMessage('Invalid location in copies.'),
		handleValidationResult,
		book.verifyAdminPermissions,
		book.create
	);

	/**
	 * Permet de récupérer les informations d'un livre.
	 * @sortie livre
	 * @auth token nécessaire, admin ou invité
	 * @status 200
	 */
	router.get("/:id",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		handleValidationResult,
		book.searchBook,
		book.verifyAdminPermissions,
		book.findOne
	);

	/**
	 * Permet de modifier un livre.
	 * @sortie livre modifié
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.put("/:id",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		body('categories').optional().isArray().withMessage('Invalid categories array.'),
		body('categories.*').isMongoId().withMessage('Invalid category id.'),
		handleValidationResult,
		book.searchBook,
		book.verifyAdminPermissions,
		book.update
	);

	/**
	 * Permet de supprimer un livre.
	 * @auth token nécessaire, admin
	 * @status 204
	 */
	router.delete("/:id",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		handleValidationResult,
		book.searchBook,
		book.verifyAdminPermissions,
		book.delete
	);

	/**
	 * Permet d'ajouter un exemplaire d'un livre.
	 * @sortie livre mis à jour
	 * @auth token nécessaire, admin
	 * @status 201
	 */
	router.post("/:id/copies/",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		body('code').isString().bail().withMessage('Missing or invalid code.')
			.trim().toUpperCase()
			.isLength({ min: 1, max: MAX_CODE_LENGTH }).withMessage('Invalid code : code must be between 1 and 10 caracters long.')
			.matches(CODE_REGEX).withMessage('Invalid code : only letters, numbers and hyphens are allowed.'),
		body('location').optional({ values: 'null' }).isMongoId().withMessage('Invalid location in copies.'),
		handleValidationResult,
		book.searchBook,
		book.verifyAdminPermissions,
		book.createCopy
	);

	/**
	 * Permet de modifier un exemplaire d'un livre.
	 * @sortie livre mis à jour
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.put("/:id/copies/:copyId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		param('copyId').isMongoId().withMessage('Invalid copy id.'),
		body('code').optional().isString().bail().withMessage('Invalid code in copies.')
			.trim().toUpperCase()
			.isLength({ min: 1, max: MAX_CODE_LENGTH }).withMessage('Invalid code in copies : code must be between 1 and 10 caracters long.')
			.matches(CODE_REGEX).withMessage('Invalid code in copies : only letters, numbers and hyphens are allowed.'),
		body('location').optional({ values: 'null' }).isMongoId().withMessage('Invalid location in copies.'),
		handleValidationResult,
		book.searchBook,
		book.verifyAdminPermissions,
		book.updateCopy
	);

	/**
	 * Permet d'ajouter un commentaire à livre.
	 * @sortie livre mis à jour
	 * @auth token necessaire, admin ou invité
	 * @status 201
	 */
	router.post("/:id/comments",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		body('rating').isInt({ min: 1, max: 5}).withMessage('Missing or invalid rating. Rating must be between 1 and 5.'),
		body('text').isString().bail().withMessage('Missing or invalid text.').trim(),
		handleValidationResult,
		book.searchBook,
		book.verifyGlobalPermissions,
		book.addComment
	);

	/**
	 * Permet de supprimer un commentaire d'un livre.
	 * @sortie livre mis à jour
	 * @auth token necessaire, auteur du commentaire
	 * @status 200
	 */
	router.delete("/:id/comments/:commentId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		param('commentId').isMongoId().withMessage('Invalid comment id.'),
		handleValidationResult,
		book.searchBook,
		book.verifyGlobalPermissions,
		book.deleteComment
	);

	/**
	 * Permet de supprimer un exemplaire d'un livre.
	 * Supprime le livre s'il s'agit du dernier exemplaire.
	 * @sortie livre mis à jour s'il reste au moins un exemplaire
	 * @auth token nécessaire, admin
	 * @status 200/204
	 */
	router.delete("/:id/copies/:copyId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid book id.'),
		param('copyId').isMongoId().withMessage('Invalid copy id.'),
		book.searchBook,
		book.verifyAdminPermissions,
		book.deleteCopy
	);

	app.use('/api/books', router);
};