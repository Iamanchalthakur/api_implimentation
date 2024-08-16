const sql = require("./db.js");
const bcrypt = require("bcryptjs");

// constructor
const User = function (user) {
  console.log("user========", user);
  (this.full_name = user.full_name), (this.age = user.age);
  this.published = user.published;
  this.email = user.email;
  this.password = user.password;
};


User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    delete newUser['password'];
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = (name, result) => {
  let query = "SELECT * FROM users";

  if (name) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.getAllPublished = (result) => {
  sql.query("SELECT * FROM users WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  sql.query(
    "UPDATE users SET full_name = ?, age = ?, published = ? WHERE id = ?",
    [fullName, user.age, user.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM Users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.removeAll = (result) => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

User.login = (payload, result) => {
  console.log("payload=======", payload);
  sql.query(
    `SELECT * FROM users WHERE email = "${payload.email}" and password = "${payload.password}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);

        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found user: ", res);
        console.log("not found user: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found User with the email
      result({ kind: "not_found" }, null);
    }
  );
};

User.profile = (id, result) => {
  sql.query("SELECT id, email, full_name FROM users WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      console.log("user: ", res[0]);
      result(null, res[0]);
    } else {
      console.log("No user found with id ", id);
      result({ kind: "not_found" }, null);
    }
  });
};





module.exports = User;
