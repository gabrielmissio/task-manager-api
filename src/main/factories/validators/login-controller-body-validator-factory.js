const { RequestValidator } = require('../../../presentation/helpers');
const { LoginController } = require('../../../presentation/validations/schemas');

const makeLoginControllerBodyValidator = () => new RequestValidator({ schema: LoginController });

module.exports = makeLoginControllerBodyValidator;
