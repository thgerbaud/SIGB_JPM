const db = require("../models");
const Book = db.book;
const Library = db.library;

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

exports.searchBook = async (req, res, next) => {
	try {
		const bookId = req.params.id;
		const doc = await Book.findOne({ _id: bookId });
		if (doc === null) {
			return res.status(404).send('Book not found.');
		}
		req.book = doc;
		next();

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.verifyAdminPermissions = async (req, res, next) => {
	try {
		const libraryId = req.book?.library || req.body.library;
		const doc = await Library.findOne({ _id: libraryId });
		if (doc === null) {
			return res.status(400).send('Invalid library id.');
		}
		const library = doc.toJSON();

		if (!library.admins.some(admin => admin.email === req.user)) {
			return res.status(403).send('Insufficient permissions.');
		}
		req.library = library;
		next();

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.create = async (req, res) => {
	try {
		const library = req.library;

		const isbn = req.body.isbn;
		const categories = req.body.categories ?? [];

		// -- vérification des exemplaires --
		const copies = req.body.copies;
		let verifiedCopies = [];

		let newCodes = [];
		for (const copy of copies) {
			// -- vérification du code --
			const code = copy.code;
			// doublons parmi les livres existants
			if (await isCodeDuplicate(library.id, code)) {
				return res.status(409).send(`Duplicate book code '${code}' in library.`);
			}
			// doublons parmi les nouveaux codes
			if (newCodes.includes(code)) {
				return res.status(409).send(`Duplicate book code '${code}' in copies.`)
			}
			newCodes.push(code);

			const location = copy.location ?? null;

			verifiedCopies.push({ code, location });
		}

		// -- création du livre --

		let book = await Book.findOne({ library: library.id, isbn: isbn });
		// TODO équivalence isbn10/13
		if (book !== null) {
			// màj des exemplaires si livre déjà existant
			/*if (book.category !== category) {
				return res.status(400).send(`Book with ISBN ${isbn} already in library with different category.`)
			}*/ //TODO
			book.copies = book.copies.concat(verifiedCopies);
		} else {
			// création d'un nouveau livre sinon
			book = new Book({
				library: library.id,
				isbn: isbn,
				categories: categories,
				copies: verifiedCopies,
				comments: []
			});
		}

		// -- enregistrement --
		const savedDoc = await book.save();
		return res.status(201).send(savedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
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
		const book = req.book.toJSON();
		return res.status(200).send(book);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
};

exports.update = async (req, res) => {
	try {
		const book = req.book;

		const newCategories = req.body.categories;
		if (newCategories !== undefined) {
			book.categories = newCategories;
		}

		// -- enregistrement --
		const updatedDoc = await book.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
};

exports.createCopy = async (req, res) => {
	try {
		const book = req.book;

		const code = req.body.code;
		if (await isCodeDuplicate(book.library.id, code)) {
			return res.status(409).send(`Duplicate book code '${code}' in library.`);
		}
		const location = req.body.location ?? null;

		book.copies.push({ code, location });
		const savedDoc = await book.save();
		return res.status(201).send(savedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send('Internal server error.');
	}
}

/**
 * Permet de modifier un exemplaire.
 * @param {*} req 
 * @param {*} res 
 **/
exports.updateCopy = async (req, res) => {
	try {
		const book = req.book;

		const copyId = req.params.copyId;
		const copy = book.copies.id(copyId); //?
		if (copy === null) {
			return res.status(404).send('Copy not found.');
		}

		const newCode = req.body.code;
		if (newCode !== undefined) {
			if (await isCodeDuplicate(book.library.id, newCode)) {
				return res.status(409).send(`Duplicate book code '${newCode}' in library.`);
			}
			copy.code = newCode;
		}
		
		const newLocation = req.body.location;
		if (newLocation !== undefined) {
			copy.location = newLocation;
		}

		const updatedDoc = await book.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.deleteCopy = async (req, res) => {
	try {

		const book = req.book;

		const copyId = req.params.copyId;
		const copy = book.copies.id(copyId);
		if (copy === null) {
			return res.status(404).send('Copy not found.');
		}

		await copy.deleteOne();
		if (book.copies.length === 0) {
			await book.deleteOne()
			return res.sendStatus(204);
		}

		const updatedDoc = await book.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.log(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.delete = async (req, res) => {
	try {
		await Book.findOneAndDelete({ _id: req.params.id });
		return res.sendStatus(204);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
};