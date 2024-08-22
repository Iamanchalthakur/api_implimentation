const Role = require("../models/role.model.js");
const bcrypt = require("bcryptjs");
const sql = require("../models/db.js");
const jwt = require("jsonwebtoken");




// Create and Save a new Role
exports.create = (req, res) => {
  if (!req.body || !req.body.role_name) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const role = new Role({
    role_name: req.body.role_name,
  });

  Role.create(role, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    }
    res.send(data);
  });
};

// Retrieve all Roles from the database
exports.findAll = (req, res) => {
  const authHeader = req.headers['x-token'];


  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
 

  if (!token) {
    return res.status(401).send({ message: "Token missing" });
  }
  
  Role.getAll((err, data) => {
    
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving roles.",
      });
    }
    res.send(data);
  });
};

// Find a single Role by Id
exports.findOne = (req, res) => {
  console.log("ID received:", req.params.id); // Add this line to debug

  Role.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found Role with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Role with id " + req.params.id,
      });
    }
    res.send(data);
  });
};


// Update a Role identified by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Role.updateById(req.params.id, new Role(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found Role with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Error updating Role with id " + req.params.id,
      });
    }
    res.send(data);
  });
};

// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
  Role.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found Role with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Could not delete Role with id " + req.params.id,
      });
    }
    res.send({ message: `Role was deleted successfully!` });
  });

};

// Delete all Roles from the database
exports.deleteAll = (req, res) => {
  Role.removeAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while removing all roles.",
      });
    }
    res.send({ message: `All Roles were deleted successfully!` });
  });
};
