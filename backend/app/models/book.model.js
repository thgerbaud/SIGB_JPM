const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const copySchema = new Schema({
	code: String,
	location: { type: Number, default: null }
});

copySchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id; // Renommer _id en id
		delete ret._id;   // Supprimer _id
	}
});

const bookSchema = new Schema({
	isbn: String,
	library: { type: Schema.Types.ObjectId, ref: 'Library' },
	categories: [Schema.Types.ObjectId],
	copies: [copySchema],
	comments: [Object] //? plus tard
});

bookSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id; // Renommer _id en id
		delete ret._id;   // Supprimer _id
		delete ret.__v;   // Supprimer __v
	}
});

const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;