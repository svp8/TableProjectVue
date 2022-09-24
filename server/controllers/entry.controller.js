const Entry = require("../models/entry.model.js");

// Create and Save a new Entry
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an Entry
  const EntryTemp = new Entry({
    name: req.body.name,
    amount: req.body.amount,
    distance: req.body.distance,
    date:req.body.date,
  });

  // Save Entry in the database
  Entry.create(EntryTemp, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Entry."
      });
    else res.send(data);
  });
};

// Retrieve all Entries from the database .
exports.findAll = (req, res) => {

  Entry.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Entries."
      });
    else res.send(data);
  });
};

// Delete a Entry with the specified id in the request
exports.delete = (req, res) => {
  Entry.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Entry with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Entry with id " + req.params.id
        });
      }
    } else res.send({ message: `Entry was deleted successfully!` });
  });
};