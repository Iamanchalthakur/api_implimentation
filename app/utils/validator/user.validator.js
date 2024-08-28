const Joi = require('joi');

// Define the schema for user validation
const userSchema = Joi.object({
    full_name: Joi.string().min(3).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
});
console.log("user validate==================================", userSchema);
// Middleware function to validate user input
const validateUser = (req, res, next) => {
    // Validate the request body against the schema
    const { error } = userSchema.validate(req.body);
    
    if (error) {
        // If validation fails, send a 400 response with error details
        return res.status(400).send({
            message: error.details[0].message,
        });
    }
    
    // If validation passes, move to the next middleware or route handler
    next();
};

module.exports = validateUser;
