const { GetBooksAndRelatedTasksController } = require('../../../presentation/controllers');
const { makeGetBooksAndRelatedTasksParamsValidator } = require('../validators');
const {
  makeGetProfileService,
  makeCheckIfTokenUserIdIsEqualToProvidedService,
  makeGetBooksAndRelatedTasksService
} = require('../services');

const makeGetBooksAndRelatedTasksController = () =>
  new GetBooksAndRelatedTasksController({
    requestParamsValidator: makeGetBooksAndRelatedTasksParamsValidator(),
    checkIfUserExistService: makeGetProfileService(),
    checkIfRequestIsAllowedService: makeCheckIfTokenUserIdIsEqualToProvidedService(),
    getBooksAndRelatedTasksService: makeGetBooksAndRelatedTasksService()
  });

module.exports = makeGetBooksAndRelatedTasksController;
