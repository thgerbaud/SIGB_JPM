const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const toJsonOptions = {
    transform: (doc, ret) => {
        ret.id = ret._id; // Renommer _id en id
        delete ret._id;   // Supprimer _id
        delete ret.__v;   // Supprimer __v
    }
}

/* ----- categories ----- */

const subsubcategorySchema = new Schema({
    name: String
});

subsubcategorySchema.set('toJSON', toJsonOptions);

const subcategorySchema = new Schema({
    name: String,
    subcategories: [subsubcategorySchema]
});

subcategorySchema.set('toJSON', toJsonOptions);

const categorySchema = new Schema({
    name: String,
    subcategories: [subcategorySchema]
});

categorySchema.set('toJSON', toJsonOptions);

/* ----- library ----- */

const librarySchema = new Schema({
    name: String,
    admins: [String],
    users: [String],
    locations: [String],
    categories: [categorySchema]
});

librarySchema.set('toJSON', toJsonOptions);

const Library = mongoose.model("Library", librarySchema, "libraries");

module.exports = Library;