const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const schemas = {};
schemas.mongoose = mongoose;
schemas.books = require("./book.schema.js")(mongoose);

module.exports = schemas;