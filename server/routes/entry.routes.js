module.exports = app => {
    const entry = require("../controllers/entry.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Entry
    router.post("/", entry.create);
  
    // Retrieve all Entries
    router.get("/", entry.findAll);
  
    // Delete an Entry with id
    router.delete("/:id", entry.delete);
  
    app.use('/api/entry', router);
  };