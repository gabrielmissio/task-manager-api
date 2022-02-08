const { RequestValidator } = require('../../../presentation/helpers');
const { LoginBodySchema } = require('../../../presentation/validations/schemas');

const makeLoginControllerBodyValidator = () => new RequestValidator({ schema: LoginBodySchema });

module.exports = makeLoginControllerBodyValidator;
