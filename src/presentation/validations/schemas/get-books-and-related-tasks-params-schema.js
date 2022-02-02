const Joi = require('joi');

const {
  Commons: { uuidValidation }
} = require('../helpers');

const GetBooksAndRelatedTasksParamsSchema = Joi.object({
  userId: uuidValidation.required()
});

module.exports = GetBooksAndRelatedTasksParamsSchema;
