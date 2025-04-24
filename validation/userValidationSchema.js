// use Joi NPM to validate the data 
const Joi = require('joi');

module.exports = {
  userValidationSchema: Joi.object({
  username: Joi.string().min(3).max(30).required().trim(),
  password: Joi.string().min(8).max(30).required(),
  passwordRepeat: Joi.valid(Joi.ref("password")).required().label("Confirm password").messages({
    "any.only": "Passwords must match",
  }),
}),

    userValidation: Joi.object({
        username: Joi.string().min(3).max(30).required().trim(),
        password: Joi.string().min(8).max(30).required().pattern(new RegExp("^[a-zA-Z0-9&*@#_|-]{8,30}$")),
        confirmPassword: Joi.ref('password'),
    }),
    
};