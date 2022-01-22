const { LoginController } = require('../../../presentation/controllers');
const { makeLoginControllerBodyValidator } = require('../validators');
const { makeLoginService } = require('../services');

const makeLoginController = () =>
  new LoginController({
    requestBodyValidator: makeLoginControllerBodyValidator(),
    loginService: makeLoginService()
  });

module.exports = makeLoginController;
