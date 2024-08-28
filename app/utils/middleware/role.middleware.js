const Role = require('../../models/role.model'); 


const validateRoleName = (req, res, next) => {
  if (!req.body.role_name) {
    return res.status(400).send({
      message: "Role name is required"
    });
  }
  next();
};

const checkTokenRequired = (req, res, next) => {
    const authHeader = req.headers['x-token'];
    
    if (!authHeader) {
      return res.status(403).send({
        message: "Token is required must"
      });
    }
  
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      return res.status(403).send({
        message: "Token is required"
      });
    }

    next();
  };
  

  

module.exports = {
  validateRoleName,
  checkTokenRequired
};
