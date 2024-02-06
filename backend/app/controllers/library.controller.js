const db = require("../models");
const Library = db.library;
const Book = db.book;

exports.create = (req, res) => {
	// vérification du nom
	const name = req.body.name?.trim();
	if (!name || name === "") {
		return res.status(400).send('Missing library name.');
	}
	// création de la bibliothèque
	const library = new Library({
		name: name,
		admins: [req.user],
		users: [],
		locations: req.body.locations || [],
		categories: req.body.categories || []
	});
	// enregistrement
	library.save()
		.then(doc => {
			res.status(201).send(doc.toJSON());
		})
		.catch(err => {
			console.error(err);
			res.status(500).send("Internal server error.");
		});
}

exports.findAll = (req, res) => {
	const user = req.user;
	Library.find({ $or: [{ 'admins': user }, { 'users': user }] })
		.then(docs => {
			const libraries = docs.map(doc => {
				const obj = doc.toJSON();
				const isAdmin = obj.admins.includes(user);
				let library = {
					id: obj.id,
					name: obj.name,
					locations: obj.locations,
					categories: obj.categories,
					isAdmin: isAdmin
				}
				if (isAdmin) {
					library.admins = obj.admins;
					library.users = obj.users;
				}
				return library;
			});
			res.status(200).send(libraries);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send("Internal server error.");
		});
}

exports.findOne = (req, res) => {
	const user = req.user;
	// vérification de l'id
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id.');
	}
	// recherche de la bibliothèque
	Library.findOne({ '_id': libraryId })
		.then(doc => {
			if (doc === null) {
				return res.status(404).send("Library not found.");
			}
			const obj = doc.toJSON();
			const isAdmin = obj.admins.includes(user);
			// vérification que l'utilisateur ait bien de le droit d'accès à la bibliothèque
			if (!(isAdmin || obj.users.includes(user))) {
				return res.status(403).send("Access denied.");
			}
			let library = {
				id: obj.id,
				name: obj.name,
				locations: obj.locations,
				categories: obj.categories,
				isAdmin: isAdmin
			}
			if (isAdmin) {
				library.admins = obj.admins;
				library.users = obj.users;
			}
			res.status(200).send(library);
		})
		.catch(err => {
			console.error(err);
			res.status(500).send("Internal server error.");
		});
}

exports.getBooks = async (req, res) => {
	const user = req.user;
	// vérification de l'id et des permissions
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id');
	}
	try {
		const doc = await Library.findOne({ _id: libraryId });
		if (doc === null) {
			return res.status(404).send("Library not found.");
		}
		const library = doc.toJSON();
		// vérification que l'utilisateur ait les droits d'administrateur
		if (!library.admins.includes(user) && !library.users.includes(user)) {
			return res.status(403).send("Access denied.");
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal server error.");
	}
	Book.find({ 'library': libraryId })
		.then(docs => {
			const books = docs.map(doc => doc.toJSON());
			res.status(200).send(books);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send("Internal server error.");
		});
}

exports.updateSettings = (req, res) => { }

exports.addAdmin = (req, res) => {
	const user = req.user;
	// vérification de l'id
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id');
	}
	// vérification du corps de la requête
	const newAdmin = req.body.admin;
	if (!newAdmin || !/^[a-zA-Z0-9._-]+@gmail\.com$/.test(newAdmin)) {
		return res.status(400).send('Missing or invalid admin email.');
	}
	// recherche de la bibliothèque
	Library.findOne({ _id: libraryId }, { admins: true })
		.then(async doc => {
			if (doc === null) {
				return res.sendStatus(404);
			}
			const library = doc.toJSON();
			// vérification que l'utilisateur y ait les droits d'administrateur
			if (!library.admins.includes(user)) {
				return res.sendStatus(403);
			}
			// vérification que l'administrateur à ajouter n'y soit pas déjà
			if (library.admins.includes(newAdmin)) {
				return res.status(400).send('Admin already added');
			}
			// mise à jour
			Library.findOneAndUpdate({ _id: libraryId }, { $push: { admins: newAdmin } }, { new: true })
				.then(doc => {
					res.status(200).send(doc.toJSON());
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(500);
		});
}

exports.addUser = (req, res) => {
	const user = req.user;
	// vérification de l'id
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id');
	}
	// vérification du corps de la requête
	const newUser = req.body.user;
	if (!newUser || !/^[a-zA-Z0-9._-]+@gmail\.com$/.test(newUser)) {
		return res.status(400).send('Missing or invalid user email.');
	}
	// recherche de la bibliothèque
	Library.findOne({ _id: libraryId }, { admins: true, users: true })
		.then(async doc => {
			if (doc === null) {
				return res.sendStatus(404);
			}
			const library = doc.toJSON();
			// vérification que l'utilisateur y ait les droits d'administrateur
			if (!library.admins.includes(user)) {
				return res.sendStatus(403);
			}
			// vérification que l'utilisateur à ajouter n'y soit pas déjà
			if (library.users.includes(newUser)) {
				return res.status(400).send('User already invited');
			}
			// mise à jour
			Library.findOneAndUpdate({ _id: libraryId }, { $push: { users: newUser } }, { new: true })
				.then(doc => {
					res.status(200).send(doc.toJSON());
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(500);
		});
}

exports.deleteUser = (req, res) => {
	const user = req.user;
	// vérification de l'id
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id');
	}
	// vérification du corps de la requête
	const userToRemove = req.body.user;
	if (!userToRemove || !/^[a-zA-Z0-9._-]+@gmail\.com$/.test(userToRemove)) {
		return res.status(400).send('Missing or invalid user email.');
	}
	// recherche de la bibliothèque
	Library.findOne({ _id: libraryId }, { admins: true, users: true })
		.then(async doc => {
			if (doc === null) {
				return res.sendStatus(404);
			}
			const library = doc.toJSON();
			// vérification que l'utilisateur y ait les droits d'administrateur
			if (!library.admins.includes(user)) {
				return res.sendStatus(403);
			}
			// vérification que l'utilisateur à supprimer y soit
			if (!library.users.includes(userToRemove)) {
				return res.status(400).send('Can\'t find user');
			}
			// mise à jour
			Library.findOneAndUpdate({ _id: libraryId }, { $pull: { users: userToRemove } }, { new: true })
				.then(doc => {
					res.status(200).send(doc.toJSON());
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(500);
		});
}

exports.delete = (req, res) => {
	const user = req.user;
	// vérification de l'id
	const libraryId = req.params.id;
	if (!db.mongoose.Types.ObjectId.isValid(libraryId)) {
		return res.status(400).send('Invalid library id');
	}
	Library.findOne({ _id: libraryId }, { admins: true })
		.then(async doc => {
			if (doc === null) {
				return res.sendStatus(404);
			}
			const library = doc.toJSON();
			// vérification que l'utilisateur y ait les droits d'administrateur
			if (!library.admins.includes(user)) {
				return res.sendStatus(403);
			}
			// suppression
			Library.deleteOne({ _id: libraryId })
				.then(() => {
					res.sendStatus(204);
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(500);
		});
}