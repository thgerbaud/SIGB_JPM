const db = require("../models");
const Book = db.book;
const Library = db.library;

// Create and Save a new Book
exports.create = async (req, res) => {
	// vérification des paramètres et permissions
	const libraryId = req.body.library;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send("Missing or invalid library id.");
	}
	try {
		const doc = await Library.findOne({ _id: libraryId });
		if (doc === null) {
			return res.status(400).send("Invalid library id.");
		}
		const library = doc.toJSON();
		// vérification que l'utilisateur ait les droits d'administrateur
		if (!library.admins.includes(req.user)) {
			return res.sendStatus(403);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
	const isbn = req.body.isbn;
	if (!isbn || !(/^[0-9]+$/.test(isbn)) || (isbn.length !== 10 && isbn.length !== 13)) {
		return res.status(400).send("Missing or invalid isbn.");
	}
	const code = req.body.code?.trim();
	if (!code || !(/^[a-zA-Z0-9]+$/.test(code)) || code.length > 10) {
		return res.status(400).send("Missing or invalid code.");
	}
	try {
		const doc = await Book.findOne({ library: libraryId, code: code });
		if (doc !== null) {
			return res.status(400).send("Duplicate book code.");
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
	const location = req.body.location ?? null;
	if ((location !== null) && !(/^[0-9]+$/.test(location))) {
		return res.status(400).send("Invalid location.");
	}
	const category = req.body.category ?? null;
	if ((category !== null) && !(/^[0-2]$/.test(category))) {
		return res.status(400).send("Invalid category.");
	}
	// création du livre 
	const book = new Book({
		library: new db.mongoose.Types.ObjectId(libraryId),
		isbn: isbn,
		code: code.toUpperCase(),
		location: location,
		category: category
	})
	// enregistrement
	book.save()
		.then(doc => {
			res.status(201).send(doc.toJSON());
		})
		.catch(err => {
			console.error(err);
			res.status(500).send("Internal server error.");
		});
}

// Retrieve all books from the database.
exports.findAll = (req, res) => {

	const library = req.params.library;

	Library.findOne({ '_id': library })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving books."
			});
		});
	/*
	Book.find(condition)
		.then(books => {
			res.send(books);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving books."
			});
		});*/
};

// Find a single Book with an id
exports.findOne = (req, res) => {

	const library = req.params.library;
	const id = req.params.code;

	Library.findOne({
		$and: [
			{ '_id': library },
			{ 'books._id': id }
		]
	}, {
		_id: false,
		'books.$': true
	}).then(data => {
		res.send(data);
	})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving books."
			});
		});
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