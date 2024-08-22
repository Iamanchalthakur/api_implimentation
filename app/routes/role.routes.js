module.exports = app => {
  const roles = require("../controllers/role.controller.js");
  const { validateRoleName, checkTokenRequired } = require("../utils/role.middleware.js");

  var router = require("express").Router();

  // Create a new Role
  router.post("/", validateRoleName, roles.create);

  // Retrieve all Roles
  router.get("/", checkTokenRequired, roles.findAll);

  // Retrieve a single Role with id
  router.get("/:id",checkTokenRequired, roles.findOne);

  // Update a Role with id
  router.put("/:id", [validateRoleName,checkTokenRequired], roles.update);

  // Delete a Role with id
  router.delete("/:id",checkTokenRequired, roles.delete);

  // Delete all Roles
  router.delete("/", checkTokenRequired, roles.deleteAll);

  app.use('/api/roles', router);
};
