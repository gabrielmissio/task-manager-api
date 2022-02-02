const { GetProfileService } = require('../../../domain/services');
const { GetProfileByUserIdRepository } = require('../../../infra/db/dynamodb/repositories');

const makeGetProfileService = () =>
  new GetProfileService({
    getProfileByUserIdRepository: new GetProfileByUserIdRepository()
  });

module.exports = makeGetProfileService;
