const Joi = require('joi');

const { passwordRegex } = require('../../../utils/regular-expressions');
const {
  ErrorMessagesEnum: { INVALID_PASSWORD, PASSWORD_RULES }
} = require('../../../utils/enums');

const emailValidation = Joi.string().email().trim();
const passwordValidation = Joi.string()
  .pattern(passwordRegex)
  .messages({
    'string.pattern.base': `${INVALID_PASSWORD}. ${PASSWORD_RULES}`
  });

module.exports = {
  emailValidation,
  passwordValidation
};
