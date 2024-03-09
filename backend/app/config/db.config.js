module.exports = {
    url: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PWD}@cluster0.thhic6a.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
}