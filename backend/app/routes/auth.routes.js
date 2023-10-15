module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
    router.post("/login", auth.login);
  
    app.use('/api/auth', router);
  };