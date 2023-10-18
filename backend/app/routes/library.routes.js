module.exports = app => {
    const library = require("../controllers/library.controller.js");
  
    var router = require("express").Router();
  
    // Create a new library
    router.post("/", library.create);
  
    // Retrieve all libraries of an user
    router.get("/:user_id", library.findAll);
  
  
    // Retrieve a library
    router.get("/library/:id", library.findOne);
  
    // Update a library with id
    router.put("/:user_id/:id", library.update);
  
    // Delete a library with id
    router.delete("/:user_id/:id", library.delete);
  
    // Delete all libraries of an user
    router.delete("/:user_id", library.deleteAll);
  
    app.use('/api/libraries', router);
  };