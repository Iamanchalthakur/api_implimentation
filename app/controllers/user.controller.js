const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const sql = require("../models/db.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dummyuser!!";

// Create and Save a new User

exports.create = async (req, res) => {
  // Validate request
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  try {
    const existingUser = await new Promise((resolve, reject) => {
      sql.query(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.length > 0);
        }
      );
    });

    if (existingUser) {
      return res.status(400).send({
        message: "Email already in use!",
      });
    }

    // Create a User
    const user = new User({
      full_name: req.body.first_name + " " + req.body.last_name,
      age: req.body.age,
      published: req.body.published || false,
      email: req.body.email,
      password: req.body.password,
    });

    user.password = await bcrypt.hash(req.body.password, 10);

    console.log("userpasswprd=========================", user.password);

    // Save User in the database
    User.create(user, (err, data) => {
      if (err) {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      }
      return res.send(data);
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error checking or creating user.",
    });
  }
};

exports.findAll = (req, res) => {
  const name = req.query.full_name;

  User.getAll(name, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    }
    res.send(data);
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Error retrieving User with id " + req.params.id,
      });
    }
    res.send(data);
  });
};

// Find all published Users
exports.findAllPublished = (req, res) => {
  User.getAllPublished((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    }
    res.send(data);
  });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  User.updateById(req.params.id, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Error updating User with id " + req.params.id,
      });
    }
    res.send(data);
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      }
      return res.status(500).send({
        message: "Could not delete User with id " + req.params.id,
      });
    }
    res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    }
    res.send({ message: `All Users were deleted successfully!` });
  });
};

// Login user from the database.
exports.login = async (req, res) => {
  // Validate request
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const user = await new Promise((resolve, reject) => {
    sql.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length > 0) {
          resolve(result[0]);
        } else {
          resolve(null); // no user found
        }
      }
    );
  });

  if (!user) {
    return res.status(401).send({
      message: "Invalid email or password!",
    });
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(401).send({
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.send({
    message: "Login successful",
    token,
  });
};

console.log("token=========================");



exports.profile = async (req, res) => {
  console.log("Profile endpoint reached"); // Debugging log
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header missing====================");
      return res.status(401).send({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token missing in header======================");
      return res.status(401).send({ message: "Token missing" });
    }

    // Verify the token and extract the user ID
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).send({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    console.log("Decoded Token================", decoded);

    if (!userId) {
      console.log("User ID not found in token");
      return res.status(401).send({ message: "Invalid token" });
    }

    console.log("Decoded User id==========:", userId); 

    // Query the database to find the user by ID
    User.profile(userId, (err, user) => {
      if (err) {
        console.log("Database error: ", err);
        return res.status(500).send({ message: "Database error" });
      }

      // Handle the case where no user is found
      if (!user) {
        return res.status(404).send({ message: `Not found User with id ${userId}.` });
      }

      // Send the user's profile information as a response
      res.send({ message: "User profile retrieved successfully", user });
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send({ message: "Error retrieving user profile.", error: error.message });
  }
};


