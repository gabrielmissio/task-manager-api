const { LoginService } = require('../../../domain/services');
const { GetProfileByEmailRepository } = require('../../../infra/db/dynamodb/repositories');
const { Encrypter, TokenGenerator } = require('../../../utils/helpers');
const { SECRET } = require('../../confing/env');
const { AuthenticationSerializer } = require('../../../domain/serializers');

const makeLoginService = () =>
  new LoginService({
    getProfileByEmailRepository: new GetProfileByEmailRepository(),
    encrypter: new Encrypter(),
    tokenGenerator: new TokenGenerator({ secret: SECRET }),
    authenticationSerializer: new AuthenticationSerializer()
  });

module.exports = makeLoginService;
