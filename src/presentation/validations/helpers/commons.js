const Joi = require('joi');

const { passwordRegex } = require('../../../utils/regular-expressions');

const emailValidation = Joi.string().email().trim();
const passwordValidation = Joi.string().pattern(passwordRegex);

module.exports = {
  emailValidation,
  passwordValidation
};
