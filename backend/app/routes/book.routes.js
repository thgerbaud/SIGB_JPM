module.exports = app => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Create a new book
    router.post("/:library/", book.create);
  
    // Retrieve all book
    router.get("/:library/", book.findAll);
  
  
    // Retrieve a single book with code
    router.get("/:library/:code", book.findOne);
  
    // Update a book with code
    router.put("/:library/:code", book.update);
  
    // Delete a book with code
    router.delete("/:library/:code", book.delete);
  
    // Delete all books
    router.delete("/:library/", book.deleteAll);
  
    app.use('/api/books', router);
  };