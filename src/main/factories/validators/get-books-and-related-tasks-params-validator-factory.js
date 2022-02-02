const { RequestValidator } = require('../../../presentation/helpers');
const { GetBooksAndRelatedTasksParamsSchema } = require('../../../presentation/validations/schemas');

const makeGetBooksAndRelatedTasksParamsValidator = () =>
  new RequestValidator({ schema: GetBooksAndRelatedTasksParamsSchema });

module.exports = makeGetBooksAndRelatedTasksParamsValidator;
