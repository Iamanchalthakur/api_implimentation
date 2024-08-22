const sql = require("./db.js");

// constructor
const Role = function(role) {
  this.role_name = role.role_name;
};

// Create a new Role
Role.create = (newRole, result) => {
  sql.query("INSERT INTO Roles SET ?", newRole, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } 
    console.log("created role: ", { id: res.insertId, ...newRole });
    result(null, { id: res.insertId, ...newRole });
  });
};

// Find a Role by Id
Role.findById = (id, result) => {
  sql.query(`SELECT * FROM Roles WHERE role_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found role: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

// Get all Roles
Role.getAll = (result) => {
  sql.query("SELECT * FROM Roles", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("roles: ", res);
    result(null, res);
  });
};

// Update a Role by Id
Role.updateById = (id, role, result) => {
  sql.query(
    "UPDATE Roles SET role_name = ? WHERE role_id = ?",
    [role.role_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated role: ", { id: id, ...role });
      result(null, { id: id, ...role });
    }
  );
};

// Delete a Role by Id
Role.remove = (id, result) => {
  sql.query("DELETE FROM Roles WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted role with id: ", id);
    result(null, res);
  });
};

// Delete all Roles
Role.removeAll = (result) => {
  sql.query("DELETE FROM Roles", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(`deleted ${res.affectedRows} roles`);
    result(null, res);
  });
};

module.exports = Role;
