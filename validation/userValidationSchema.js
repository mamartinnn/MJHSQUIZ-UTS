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
    
  questionValidationSchema: Joi.object({
    question: Joi.string().min(1).max(500).required(),
    answers: Joi.array()
      .items(Joi.string().min(1).max(100).required())
      .length(4)
      .required(),
    correct: Joi.string().pattern(new RegExp("^[0-3]$")).required(),
  }),
};
