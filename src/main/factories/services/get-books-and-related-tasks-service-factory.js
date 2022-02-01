const { GetBooksAndRelatedTasksService } = require('../../../domain/services');
const { GetProfileByUserIdRepository } = require('../../../infra/db/dynamodb/repositories');

const makeGetBooksAndRelatedTasksService = () =>
  new GetBooksAndRelatedTasksService({
    getProfileByUserIdRepository: new GetProfileByUserIdRepository()
  });

module.exports = makeGetBooksAndRelatedTasksService;
