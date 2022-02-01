const { CheckIfTokenUserIdIsEqualToProvidedService } = require('../../../domain/services');
const { TokenDecoder } = require('../../../utils/helpers');

const makeCheckIfTokenUserIdIsEqualToProvidedService = () =>
  new CheckIfTokenUserIdIsEqualToProvidedService({
    tokenDecoder: new TokenDecoder()
  });

module.exports = makeCheckIfTokenUserIdIsEqualToProvidedService;
