const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const bookSchema = new Schema({
	isbn: String,
	code: String,
	library: { type: Schema.Types.ObjectId, ref: 'Library' },
	location: { type: Number, default: null },
	category: { type: Number, default: null }
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