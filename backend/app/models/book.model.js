module.exports = mongoose => {
	const Book = mongoose.model(
		"book",
		mongoose.Schema(
			{
				isbn: String,
				title: String,
				author: [String],
				code: String,
				description: String,
				image: String,
				publication: String,
				location: String
			}
		)
	);

	return Book;
};