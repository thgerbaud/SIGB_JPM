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
 * @param {String} library id de la bibliothèque où chercher
 * @param {String} code code à chercher
 * @param {String} bookId id du livre à modifier si échéant (exclu de la recherche)
 * @returns {Promise<boolean>}
 */
async function isCodeDuplicate(library, code, bookId = null) {
	try {
		let query = { library: new db.mongoose.Types.ObjectId(library), code };
		if (bookId) {
			query._id = { $ne: new db.mongoose.Types.ObjectId(bookId) }
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

		// -- vérification des paramètres --
		// ISBN
		const isbn = req.body.isbn;
		if (!isbn || !(/^[0-9]+$/.test(isbn)) || (isbn.length !== 10 && isbn.length !== 13)) {
			return res.status(400).send("Missing or invalid isbn.");
		}
		// code
		const code = req.body.code?.trim().toUpperCase();
		if (!isCodeValid(code)) {
			return res.status(400).send("Missing or invalid code.");
		}
		if (await isCodeDuplicate(library.id, code)) {
			return res.status(400).send("Duplicate book code.");
		}
		// emplacement
		const location = req.body.location ?? null;
		if ((location !== null) && (!(/^[0-9]+$/.test(location)) || parseInt(location) >= library.locations.length)) {
			return res.status(400).send("Invalid location.");
		}
		// categorie
		const category = req.body.category ?? null;
		if ((category !== null) && !(/^[0-2]$/.test(category))) {
			return res.status(400).send("Invalid category.");
		}

		// -- création du livre --
		const book = new Book({
			library: new db.mongoose.Types.ObjectId(libraryId),
			isbn: isbn,
			code: code,
			location: location,
			category: category
		});

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
};

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
		// code
		const newCode = req.body.code?.trim().toUpperCase();
		if (newCode !== undefined) {
			if (!isCodeValid(newCode)) {
				return res.status(400).send("Invalid code.");
			}
			if (await isCodeDuplicate(library._id, newCode, doc._id)) {
				return res.status(400).send("Duplicate book code.");
			}
			doc.code = newCode;
		}
		// emplacement
		const newLocation = req.body.location;
		if (newLocation !== undefined) {
			if ((newLocation === null) || !(/^[0-9]+$/.test(newLocation)) || parseInt(newLocation) >= library.locations.length) {
				return res.status(400).send("Invalid location.");
			}
			doc.location = parseInt(newLocation);
		}
		// categorie
		const newCategory = req.body.category;
		if (newCategory !== undefined) {
			if ((newCategory === null) || !(/^[0-2]$/.test(newCategory))) {
				return res.status(400).send("Invalid category.");
			}
			doc.category = parseInt(newCategory);
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