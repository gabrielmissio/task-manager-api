const { RequestValidator } = require('../../../presentation/helpers');
const { LoginControllerBodySchema } = require('../../../presentation/validations/schemas');

const makeLoginControllerBodyValidator = () => new RequestValidator({ schema: LoginControllerBodySchema });

module.exports = makeLoginControllerBodyValidator;
