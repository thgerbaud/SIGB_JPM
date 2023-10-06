module.exports = mongoose => {
    const BookSchema = mongoose.Schema(
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
    );

    return BookSchema;
}