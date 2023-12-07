const schemas = require("../schemas");

module.exports = mongoose => {
	const Library = mongoose.model(
		"library",
		mongoose.Schema(
			{
				name: String,
				admin: [String],
				books: [schemas.books],
				locations: [String],
				categories: [String] 
			}
		)
	);

	return Library;
};