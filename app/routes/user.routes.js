module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
    
    

    // Login a new User
    router.post("/login", users.login);
  
    // Create a new User
    router.post("/", users.create);
  
    // Retrieve all User
    router.get("/", users.findAll);
  
    // Retrieve all published User
    router.get("/published", users.findAllPublished);
  //get user profile  

  router.get("/profile", users.profile);
  
    // Retrieve a single users with id
    router.get("/:id", users.findOne);
  
    // Update a users with id
    router.put("/:id", users.update);
  
    // Delete a users with id
    router.delete("/:id", users.delete);
  
    // Delete all users
    router.delete("/", users.deleteAll);

    

    
  
    app.use('/api/users', router);
  };
  