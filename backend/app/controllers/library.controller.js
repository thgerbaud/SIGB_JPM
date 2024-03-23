const jwt = require('jsonwebtoken');
const db = require("../models");
const { inviteAdmin, inviteGuest } = require("../services/email.service");

const Library = db.library;
const Book = db.book;

const INVITATION_CODE_EXP = '10d';

//TODO uniformiser message erreur

function formatLibrary(raw, user) {
	const isAdmin = raw.admins.some(admin => admin.email === user);
	const library = {
		id: raw.id,
		name: raw.name,
		locations: raw.locations,
		categories: raw.categories,
		isAdmin: isAdmin
	}
	if (isAdmin) {
		library.admins = raw.admins;
		library.users = raw.users;
	}
	return library;
}

function hasDuplicates(arr) {
	return new Set(arr).size !== arr.length;
}

exports.searchLibrary = async (req, res, next) => {
	try {
		const id = req.params.id;
		const library = await Library.findOne({ _id: id });
		if (library === null) {
			return res.status(404).send('Library not found.');
		}
		req.library = library;
		next();

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.verifyAdminPermissions = async (req, res, next) => {
	try {
		const library = req.library;
		if (!library.admins.some(admin => admin.email === req.user && !admin.pending)) {
			return res.status(403).send('Insufficient permissions.');
		}
		next();

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.verifyGlobalPermissions = async (req, res, next) => {
	try {
		const library = req.library;
		if (!library.admins.some(admin => admin.email === req.user && !admin.pending)
			&& !library.users.some(user => user.email === req.user && !user.pending)) {
			return res.status(403).send('Insufficient permissions.');
		}
		next();

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.create = async (req, res) => {
	try {
		const name = req.body.name;
		const categories = req.body.categories || [];
		const locations = req.body.locations || [];

		if (hasDuplicates(locations)) {
			return res.status(409).send('Duplicate names in locations.')
		}

		const library = new Library({
			name: name,
			admins: [{ email: req.user, pending: false }],
			users: [],
			locations: locations.map(name => ({ name })),
			categories: categories
		});

		const doc = await library.save();
		res.status(201).send(doc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.findAll = async (req, res) => {
	try {
		const user = req.user;

		const docs = await Library.find({ $or: [{ 'admins.email': user }, { 'users.email': user }] });
		const libraries = docs?.map(doc => formatLibrary(doc.toJSON(), user)) || [];

		return res.status(200).send(libraries);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.findOne = (req, res) => {
	try {
		const library = formatLibrary(req.library.toJSON(), req.user);
		return res.status(200).send(library);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.getBooks = async (req, res) => {
	try {
		const docs = await Book.find({ 'library': req.params.id });
		const books = docs?.map(doc => doc.toJSON()) || [];
		return res.status(200).send(books);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

/* ========== PARAMETRES GLOBAUX ========== */

/* ---------- emplacements ---------- */

exports.addLocation = async (req, res) => {
	try {
		const library = req.library;
		const name = req.body.name;

		if (library.locations.some(location => location.name === name)) {
			return res.status(409).send('A location already exists with this name.');
		}

		library.locations.push({ name });
		const updatedDoc = await library.save();
		return res.status(201).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.editLocation = async (req, res) => {
	try {
		const library = req.library;
		const locationId = req.params.locationId;

		const index = library.locations.findIndex(location => location._id.toString() === locationId);
		if (index < 0) {
			return res.status(404).send('Location not found.');
		}

		const name = req.body.name;
		if (library.locations.some(location => location.name === name && location._id.toString() !== locationId)) {
			return res.status(409).send('An other location already exists with this name.');
		}

		library.locations[index].name = name;
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.deleteLocation = async (req, res) => {
	try {
		const library = req.library;
		const locationId = req.params.locationId;

		const index = library.locations.findIndex(location => location._id.toString() === locationId);
		if (index < 0) {
			return res.status(404).send('Location not found.')
		}

		library.locations.splice(index, 1);
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

/* ---------- catégories ---------- */

function addSubcategory(categories, parent, name) {
	for (const category of categories) {
		if (category._id.toString() === parent) {
			category.subcategories.push({
				name: name,
				subcategories: []
			});
			return categories;
		} else if (category.subcategories) {
			for (const subcategory of category.subcategories) {
				if (subcategory._id.toString() === parent) {
					subcategory.subcategories.push({
						name: name,
						subcategories: []
					});
					return categories;
				}
			}
		}
	}
	return null;
}

function updateCategories(categories, id, newName) {
	for (const category of categories) {
		if (category._id.toString() === id) {
			category.name = newName;
			return categories;
		} else if (category.subcategories) {
			for (const subcategory of category.subcategories) {
				if (subcategory._id.toString() === id) {
					subcategory.name = newName;
					return categories;
				} else if (subcategory.subcategories) {
					for (const subsubcategory of subcategory.subcategories) {
						if (subsubcategory._id.toString() === id) {
							subsubcategory.name = newName;
							return categories;
						}
					}
				}
			}
		}
	}
	return null;
}

function deleteCategory(categories, id) {
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		if (category._id.toString() === id) {
			categories.splice(i, 1);
			return categories;
		} else if (category.subcategories) {
			for (let j = 0; j < category.subcategories.length; j++) {
				const subcategory = category.subcategories[j];
				if (subcategory._id.toString() === id) {
					category.subcategories.splice(j, 1);
					return categories;
				} else if (subcategory.subcategories) {
					for (let k = 0; k < subcategory.subcategories.length; k++) {
						const subsubcategory = subcategory.subcategories[k];
						if (subsubcategory._id.toString() === id) {
							subcategory.subcategories.splice(k, 1);
							return categories;
						}
					}
				}
			}
		}
	}
	return null;
}

function flattenCategories(categories) {
	const flattenedCategories = [];

	function flatten(category) {
		flattenedCategories.push({ name: category.name, id: category._id.toString() });

		if (category.subcategories) {
			category.subcategories.forEach(subcategory => {
				flatten(subcategory);
			});
		}
	}

	categories.forEach(category => {
		flatten(category);
	});

	return flattenedCategories;
}

exports.addCategory = async (req, res) => {
	try {
		const library = req.library;

		const name = req.body.name;
		const parent = req.body.parent;

		if (flattenCategories(library.categories).some((category => category.name === name))) {
			return res.status(409).send('Duplicate category name.');
		}

		if (parent) {
			const updatedCategories = addSubcategory(library.categories, parent, name);
			if (!updatedCategories) {
				return res.status(404).send('Parent category not found.');
			}
			library.categories = updatedCategories;
		} else {
			library.categories.push({
				name: name,
				subcategories: []
			});
		}

		const updatedDoc = await library.save();
		return res.status(201).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.editCategory = async (req, res) => {
	try {
		const library = req.library;

		const name = req.body.name;
		const categoryId = req.params.categoryId;

		const updatedCategories = updateCategories(library.categories, categoryId, name);

		if (!updatedCategories) {
			return res.status(404).send('Category not found.');
		}

		if (flattenCategories(library.categories).some((category => category.name === name && category.id !== categoryId))) {
			return res.status(409).send('Duplicate category name.');
		}

		library.categories = updatedCategories;
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.deleteCategory = async (req, res) => {
	try {
		const library = req.library;

		const categoryId = req.params.categoryId;
		const updatedCategories = deleteCategory(library.categories, categoryId);

		if (!updatedCategories) {
			return res.status(404).send('Category not found.');
		}

		library.categories = updatedCategories;
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

/* ========== UTILISATEURS ========== */

exports.verifyInvitationCode = async (req, res, next) => {
	try {
		const token = req.query.code;

		if (!token) {
			return res.status(400).send('Missing invitation code.');
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded.email;
		next();

	} catch (err) {
		console.error(err);
		return res.status(400).send('Invalid invitation code. The code may have expired.')
	}
}

/* ---------- admins ---------- */

exports.inviteAdmin = async (req, res) => {
	try {
		const user = req.user;
		const library = req.library;
		const email = req.body.email;

		if (library.admins.some(admin => admin.email === email)) {
			return res.status(409).send('Admin already added.');
		}
		const index = library.users.findIndex(guest => guest.email === email);

		const code = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: INVITATION_CODE_EXP });

		const infos = await inviteAdmin(email, user, library, code);
		if (!infos) {
			return res.status(500).send('Coulnd\'t send email.');
		}

		const newAdmin = {
			email: email,
			pending: true
		}

		library.admins.push(newAdmin);
		if (index >= 0) {
			library.users.splice(index, 1);
		}

		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.acceptAdminInvitation = async (req, res) => {
	try {
		const library = req.library;
		const user = req.user;

		const index = library.admins.findIndex(admin => admin.email === user)
		if (index < 0) {
			return res.status(404).send('Admin not found.');
		}

		library.admins[index].pending = false;
		const updatedDoc = await library.save();
		return res.status(200).send('Invitation accepted.');

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.deleteAdmin = async (req, res) => {
	try {
		const library = req.library;

		const index = library.admins.findIndex(admin => admin._id.toString() === req.params.adminId)
		if (index < 0) {
			return res.status(404).send('Admin not found.');
		}

		library.admins.splice(index, 1);
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

/* ---------- invités ---------- */

exports.inviteUser = async (req, res) => {
	try {
		const user = req.user;
		const library = req.library;
		const email = req.body.email;

		if (library.users.some(guest => guest.email === email) || library.admins.some(admin => admin.email === email)) {
			return res.status(409).send('User already added.');
		}

		const code = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: INVITATION_CODE_EXP });

		const infos = await inviteGuest(email, user, library, code);
		if (!infos) {
			return res.status(500).send('Coulnd\'t send email.');
		}

		const newGuest = {
			email: email,
			pending: true
		}

		library.users.push(newGuest);
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.acceptUserInvitation = async (req, res) => {
	try {
		const library = req.library;
		const user = req.user;

		const index = library.users.findIndex(guest => guest.email === user)
		if (index < 0) {
			return res.status(404).send('User not found.');
		}

		library.admins[index].pending = false;
		const updatedDoc = await library.save();
		return res.status(200).send('Invitation accepted.');

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

exports.deleteUser = async (req, res) => {
	try {
		const library = req.library;

		const index = library.users.findIndex(guest => guest._id.toString() === req.params.userId);
		if (index < 0) {
			return res.status(404).send('User not found.');
		}

		library.users.splice(index, 1);
		const updatedDoc = await library.save();
		return res.status(200).send(updatedDoc.toJSON());

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}

/* ========== ========== */

exports.delete = async (req, res) => {
	try {
		const library = req.library;
		await library.deleteOne();
		await Book.deleteMany({ library: library._id });
		return res.sendStatus(204);

	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal server error.');
	}
}