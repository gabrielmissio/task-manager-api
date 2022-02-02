const { GetBooksAndRelatedTasksService } = require('../../../domain/services');
const { GetBooksAndRelatedTasksByUserIdRepository } = require('../../../infra/db/dynamodb/repositories');

const makeGetBooksAndRelatedTasksService = () =>
  new GetBooksAndRelatedTasksService({
    getBooksAndRelatedTasksByUserIdRepository: new GetBooksAndRelatedTasksByUserIdRepository()
  });

module.exports = makeGetBooksAndRelatedTasksService;
