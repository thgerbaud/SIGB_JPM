const { body, param, validationResult, query } = require('express-validator');
const { getTokenInfos } = require("../controllers/auth.controller.js");
const library = require("../controllers/library.controller.js");

const GMAIL_REGEX = /^[a-zA-Z0-9.]{6,30}@gmail\.com$/;

function handleValidationResult(req, res, next) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).send({ errors: result.formatWith(error => error.msg).array() });
	} else {
		next();
	}
}

//TODO regex names ?

module.exports = app => {

	const router = require('express').Router();

	/**
	 * Permet de créer une nouvelle bibliothèque.
	 * @sortie bibliothèque créée
	 * @auth token nécessaire
	 * @status 201
	 */
	router.post("/",
		getTokenInfos,
		body('name').isString().bail().withMessage('Invalid or missing library name.')
			.trim().notEmpty().withMessage('Library name must not be empty.'),
		body('categories').optional().isArray().withMessage('Invalid categories array.'),
		//TODO categories.*
		body('locations').optional().isArray().withMessage('Invalid locations array.'),
		body('locations.*').isString().bail().withMessage('Invalid name in locations.')
			.trim().notEmpty().withMessage('Invalid name in locations, name must not be empty.'),
		handleValidationResult,
		library.create
	);

	/**
	 * Permet de retrouver toutes les bibliothèques d'un utilisateur.
	 * @sortie liste de bibliothèques
	 * @auth token nécessaire
	 * @status 200
	 */
	router.get("/",
		getTokenInfos,
		library.findAll
	);

	/**
	 * Permet de retrouver les informations d'une bibliothèque.
	 * @sortie bibliothèque correspondant à l'id
	 * @auth token nécessaire, admin ou invité
	 * @status 200
	 */
	router.get("/:id",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyGlobalPermissions,
		library.findOne
	);

	/**
	 * Permet de retrouver les livres d'une bibliothèque.
	 * @sortie liste de livres
	 * @auth token nécessaire, admin ou invité
	 * @status 200
	 */
	router.get("/:id/books",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyGlobalPermissions,
		library.getBooks
	);

	/**
	 * Permet d'ajouter un nouvel emplacement.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 201
	 */
	router.post("/:id/locations",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		body('name').isString().bail().withMessage('Missing or invalid location name.')
			.trim().notEmpty().withMessage('Location name must not be empty.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.addLocation
	);

	/**
	 * Permet de modifier un emplacement.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.put("/:id/locations/:locationId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('locationId').isMongoId().withMessage('Invalid location id.'),
		body('name').isString().bail().withMessage('Missing or invalid new location name.')
			.trim().notEmpty().withMessage('New location name must not be empty.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.editLocation
	);

	/**
	 * Permet de supprimer un emplacement.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.delete("/:id/locations/:locationId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('locationId').isMongoId().withMessage('Invalid location id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.deleteLocation
	);

	router.post("/:id/categories",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		body('name').isString().bail().withMessage('Missing or invalid category name.')
			.trim().notEmpty().withMessage('Category name must not be empty.'),
		body('parent').optional().isMongoId().withMessage('Invalid parent category id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.addCategory
	);

	router.put("/:id/categories/:categoryId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('categoryId').isMongoId().withMessage('Invalid category id.'),
		body('name').isString().bail().withMessage('Missing or invalid new category name.')
			.trim().notEmpty().withMessage('New category name must not be empty.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.editCategory
	);

	router.delete("/:id/categories/:categoryId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('categoryId').isMongoId().withMessage('Invalid category id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.deleteCategory
	);

	/**
	 * Permet d'inviter un administrateur.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.post("/:id/admins",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		body('email').matches(GMAIL_REGEX).withMessage('Missing or invalid gmail adress.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.inviteAdmin
	);

	router.get("/:id/admins",
		query('code').isJWT().withMessage('Missing or invalid invitation code.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyInvitationCode,
		library.acceptAdminInvitation
	);

	/**
	 * Permet de supprimer un administrateur.
	 * @sortie bibliothèque modifiée
	 * @auth token necessaire, admin
	 * @status 200
	 */
	router.delete("/:id/admins/:adminId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('adminId').isMongoId().withMessage('Invalid admin id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.deleteAdmin
	);

	/**
	 * Permet d'inviter un utilisateur.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.post("/:id/users",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		body('email').matches(GMAIL_REGEX).withMessage('Missing or invalid gmail adress.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.inviteUser
	);

	router.get("/:id/users",
		query('code').isJWT().withMessage('Missing or invalid invitation code.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyInvitationCode,
		library.acceptUserInvitation
	);

	/**
	 * Permet de supprimer un utilisateur.
	 * @sortie bibliothèque modifiée
	 * @auth token nécessaire, admin
	 * @status 200
	 */
	router.delete("/:id/users/:userId",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		param('userId').isMongoId().withMessage('Invalid user id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.deleteUser
	);

	/**
	 * Permet de supprimer une bibliothèque.
	 * @auth token nécessaire, admin
	 * @status 204
	 */
	router.delete("/:id",
		getTokenInfos,
		param('id').isMongoId().withMessage('Invalid library id.'),
		handleValidationResult,
		library.searchLibrary,
		library.verifyAdminPermissions,
		library.delete
	);

	app.use('/api/libraries', router);
};