const db = require("../models");
const Library = db.library;

exports.create = (req, res) => {
	const library = new Library({
		name: req.body.name,
		admin: req.body.admin,
		books: req.body.books
	});

	library
		.save(library)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the library."
			});
		});
}

exports.findAll = (req, res) => {
	const user = req.params.user_id;

	Library.find({ 'admin': user })
		.then(libraries => {
			res.send(libraries);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving books."
			});
		});
}

exports.findOne = (req, res) => {

}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {

}