module.exports = app => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Create a new book
    router.post("/", book.create);
  
    // Retrieve all book
    router.get("/", book.findAll);
  
  
    // Retrieve a single book with code
    router.get("/:code", book.findOne);
  
    // Update a book with code
    router.put("/:code", book.update);
  
    // Delete a book with code
    router.delete("/:code", book.delete);
  
    // Delete all books
    router.delete("/", book.deleteAll);
  
    app.use('/api/books', router);
  };