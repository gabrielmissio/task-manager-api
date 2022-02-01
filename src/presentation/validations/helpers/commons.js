const Joi = require('joi');

const { passwordRegex, uuidRegex } = require('../../../utils/regular-expressions');
const {
  ErrorMessagesEnum: { INVALID_PASSWORD, INVALID_ID, PASSWORD_RULES }
} = require('../../../utils/enums');

const emailValidation = Joi.string().email().trim();

const passwordValidation = Joi.string()
  .pattern(passwordRegex)
  .messages({
    'string.pattern.base': `${INVALID_PASSWORD}. ${PASSWORD_RULES}`
  });

const uuidValidation = Joi.string().pattern(uuidRegex).messages({
  'string.pattern.base': INVALID_ID
});

module.exports = {
  emailValidation,
  passwordValidation,
  uuidValidation
};
