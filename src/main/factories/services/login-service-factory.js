const { LoginService } = require('../../../domain/services');
const { GetProfileByEmailRepository } = require('../../../infra/db/dynamodb/repositories');
const { Encrypter, TokenGenerator } = require('../../../utils/helpers');
const { SECRET } = require('../../confing/env');

const makeLoginService = () =>
  new LoginService({
    getProfileByEmailRepository: new GetProfileByEmailRepository(),
    encrypter: new Encrypter(),
    tokenGenerator: new TokenGenerator({ secret: SECRET })
  });

module.exports = makeLoginService;
