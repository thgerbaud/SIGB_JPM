const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const librarySchema = new Schema({
	name: String,
	admins: [String],
	users: [String],
	books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
	locations: [String],
	categories: [String]
});

librarySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // Renommer _id en id
        delete ret._id;   // Supprimer _id
        delete ret.__v;   // Supprimer __v
    }
});

const Library = mongoose.model("Library", librarySchema, "libraries");

module.exports = Library;