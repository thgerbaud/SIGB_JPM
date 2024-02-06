const db = require("../models");
const Book = db.book;
const Library = db.library;

const CODE_REGEX = /^[a-zA-Z0-9]+$/;
const MAX_CODE_LENGTH = 10;

/**
 * Indique si un code est valide.
 * @param {String} code 
 * @returns {boolean}
 */
function isCodeValid(code) {
	return code && (CODE_REGEX.test(code)) && code.length <= MAX_CODE_LENGTH;
}

/**
 * Indique si un livre porte déjà un certain code dans une bibliothèque.
 * @param {String} libraryId id de la bibliothèque où chercher
 * @param {String} code code à chercher
 * @param {String} copyId id de l'exemplaire à modifier si échéant (exclu de la recherche)
 * @returns {Promise<boolean>}
 */
async function isCodeDuplicate(libraryId, code, copyId = null) {
	try {
		let query = {};
		if (copyId) {
			query = {
				'library': new db.mongoose.Types.ObjectId(libraryId),
				'copies': {
					$elemMatch: {
						'code': copyCode,
						'_id': { $ne: copyId }
					}
				}
			}
		} else {
			query = { 'library': new db.mongoose.Types.ObjectId(libraryId), 'copies.code': code };
		}
		const doc = await Book.findOne(query);
		return doc !== null;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

/**
 * Permet de créer un nouveau livre.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async (req, res) => {
	try {
		// -- vérification des permissions --
		const libraryId = req.body.library;
		if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
			return res.status(400).send("Missing or invalid library id.");
		}
		const doc = await Library.findOne({ _id: libraryId });
		if (doc === null) {
			return res.status(400).send("Invalid library id.");
		}
		const library = doc.toJSON();
		if (!library.admins.includes(req.user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- vérification des paramètres communs --
		// ISBN
		const isbn = req.body.isbn;
		if (!isbn || !(/^[0-9]+$/.test(isbn)) || (isbn.length !== 10 && isbn.length !== 13)) {
			return res.status(400).send("Missing or invalid isbn.");
		}

		// categorie
		const category = req.body.category ?? null;
		if ((category !== null) && !(/^[0-2]$/.test(category))) {
			return res.status(400).send("Invalid category.");
		}

		// -- vérification des exemplaires --
		const copies = req.body.copies;
		let verifiedCopies = [];
		if (!Array.isArray(copies) || copies.length === 0) {
			return res.status(400).send("Invalid or missing copies.");
		}
		let newCodes = [];
		for (const copy of copies) {
			// -- vérification du code --
			const code = copy.code?.trim().toUpperCase();
			// format
			if (!isCodeValid(code)) {
				return res.status(400).send("Missing or invalid code in copies.");
			}
			// doublons parmi les livres existants
			if (await isCodeDuplicate(library.id, code)) {
				return res.status(400).send(`Duplicate book code '${code}' in library.`);
			}
			// doublons parmi les nouveaux codes
			if (newCodes.includes(code)) {
				return res.status(400).send(`Duplicate book code '${code}' in copies.`)
			}
			newCodes.push(code);

			// -- vérification de l'emplacement
			const location = copy.location ?? null;
			if ((location !== null) && (!(/^[0-9]+$/.test(location)) || parseInt(location) >= library.locations.length)) {
				return res.status(400).send(`Invalid location for copy with code ${code}.`);
			}

			verifiedCopies.push({ code, location });
		}

		// -- création du livre --

		let book = await Book.findOne({ library: libraryId, isbn: isbn });
		// TODO équivalence isbn10/13
		if (book !== null) {
			// màj des exemplaires si livre déjà existant
			if (book.category !== category) {
				return res.status(400).send(`Book with ISBN ${isbn} already in library with different category.`)
			}
			book.copies = book.copies.concat(verifiedCopies);
		} else {
			// création d'un nouveau livre sinon
			book = new Book({
				library: new db.mongoose.Types.ObjectId(libraryId),
				isbn: isbn,
				category: category,
				copies: verifiedCopies,
				comments: []
			});
		}

		// -- enregistrement --
		const savedDoc = await book.save();
		return res.status(201).send(savedDoc.toJSON());

	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error.");
	}
}

/**
 * Permet de retrouver un livre.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.findOne = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const doc = await Book.findOne({ _id: bookId });
		if (doc === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions -- 
		const library = await Library.findOne({ _id: doc.library });
		if (library === null) {
			return res.status(404).send("Library not found.");
		}
		if (!(library.admins.includes(user) || library.users.includes(user))) {
			return res.status(403).send("Access denied.");
		}

		// -- envoi --
		return res.status(200).send(doc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
}; //TODO update (populate)

/**
 * Permet de mettre à jour un livre.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.update = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const doc = await Book.findOne({ _id: bookId });
		if (doc === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions --
		const library = await Library.findOne({ _id: doc.library });
		if (library === null) {
			return res.status(404).send("Library not found.");
		}
		if (!library.admins.includes(user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- vérifications et màj des nouveaux paramètres --
		// categorie
		const newCategory = req.body.category;
		if (newCategory !== undefined) {
			if(newCategory === null) {
				doc.category = null;
			} else if (!(/^[0-2]$/.test(newCategory))) {
				return res.status(400).send("Invalid category.");
			} else {
				doc.category = parseInt(newCategory);
			}
		}

		// -- enregistrement --
		const updatedDoc = await doc.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
};

/**
 * Permet d'ajouter un exemplaire d'un livre.
 * @param {*} req 
 * @param {*} res 
 */
exports.createCopy = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const book = await Book.findOne({ _id: bookId }).populate('library');
		if (book === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions --
		if (!book.library) {
			return res.status(404).send("Library not found.");
		}
		if (!book.library.admins.includes(user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- vérification des paramètres --
		// code
		const code = req.body.code?.trim().toUpperCase();
		if (!isCodeValid(code)) {
			return res.status(400).send("Missing or invalid code.");
		}
		if (await isCodeDuplicate(book.library.id, code)) {
			return res.status(400).send(`Duplicate book code '${code}' in library.`);
		}
		// emplacement
		const location = req.body.location ?? null;
		if ((location !== null) && (!(/^[0-9]+$/.test(location)) || parseInt(location) >= book.library.locations.length)) {
			return res.status(400).send("Invalid location.");
		}

		// -- enregistrement --
		book.copies.push({ code, location });
		const savedDoc = await book.save();
		return res.status(201).send(savedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send("Internal server error.");
	}
}

/**
 * Permet de modifier un exemplaire.
 * @param {*} req 
 * @param {*} res 
 **/
exports.updateCopy = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id du livre --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const book = await Book.findOne({ _id: bookId }).populate('library');
		if (book === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions --
		if (!book.library) {
			return res.status(404).send("Library not found.");
		}
		if (!book.library.admins.includes(user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- vérification de l'id de l'exemplaire --
		const copyId = req.params.copyId;
		if (!db.mongoose.Types.ObjectId.isValid(copyId)) {
			return res.status(400).send("Invalid copy id.");
		}
		const copy = book.copies.id(copyId);
		if (copy === null) {
			return res.status(404).send("Copy not found.");
		}

		// -- vérification et màj des paramètres --
		// code
		const newCode = req.body.code?.trim().toUpperCase();
		if (newCode !== undefined) {
			if (!isCodeValid(newCode)) {
				return res.status(400).send("Invalid code.");
			}
			if (await isCodeDuplicate(book.library.id, newCode)) {
				return res.status(400).send(`Duplicate book code '${newCode}' in library.`);
			}
			copy.code = newCode;
		}
		// emplacement
		const newLocation = req.body.location;
		if(newLocation !== undefined) {
			if ((newLocation !== null) && (!(/^[0-9]+$/.test(newLocation)) || parseInt(newLocation) >= book.library.locations.length)) {
				return res.status(400).send("Invalid location.");
			}
			copy.location = newLocation;
		}

		// -- enregistrement -- 

		const updatedDoc = await book.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send("Internal server error.");
	}
}

/**
 * Permet de supprimer un exemplaire.
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCopy = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id du livre --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const book = await Book.findOne({ _id: bookId }).populate('library');
		if (book === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions --
		if (!book.library) {
			return res.status(404).send("Library not found.");
		}
		if (!book.library.admins.includes(user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- vérification de l'id de l'exemplaire --
		const copyId = req.params.copyId;
		if (!db.mongoose.Types.ObjectId.isValid(copyId)) {
			return res.status(400).send("Invalid copy id.");
		}
		const copy = book.copies.id(copyId);
		if (copy === null) {
			return res.status(404).send("Copy not found.");
		}

		// -- suppression -- 
		await copy.deleteOne();
		if (book.copies.length === 0) {
			await book.deleteOne()
			return res.sendStatus(204);
		}

		const updatedDoc = await book.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send("Internal server error.");
	}
}

/**
 * Permet de supprimer un livre.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.delete = async (req, res) => {
	try {
		const user = req.user;

		// -- vérification de l'id --
		const bookId = req.params.id;
		if (!db.mongoose.Types.ObjectId.isValid(bookId)) {
			return res.status(400).send("Invalid book id.");
		}
		const doc = await Book.findOne({ _id: bookId });
		if (doc === null) {
			return res.status(404).send("Book not found.");
		}

		// -- vérification des permissions --
		const library = await Library.findOne({ _id: doc.library });
		if (library === null) {
			return res.status(404).send("Library not found.");
		}
		if (!library.admins.includes(user)) {
			return res.status(403).send("Insufficient permissions.");
		}

		// -- suppression --
		await Book.findOneAndDelete({ _id: bookId });
		return res.sendStatus(204);

	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
};