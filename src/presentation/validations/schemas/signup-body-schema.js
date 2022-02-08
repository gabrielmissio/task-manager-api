const Joi = require('joi');

const {
  Commons: { emailValidation, passwordValidation }
} = require('../helpers');

const SignupBodySchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: emailValidation.required(),
  password: passwordValidation.required()
});

module.exports = SignupBodySchema;
