const Joi = require('joi');

const {
  Commons: { emailValidation, passwordValidation }
} = require('../helpers');

const LoginRouterBodySchema = Joi.object({
  email: emailValidation.required(),
  password: passwordValidation.required()
});

module.exports = LoginRouterBodySchema;
