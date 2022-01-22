const Joi = require('joi');

const {
  Commons: { emailValidation, passwordValidation }
} = require('../helpers');

const LoginControllerBodySchema = Joi.object({
  email: emailValidation.required(),
  password: passwordValidation.required()
});

module.exports = LoginControllerBodySchema;
