const { HttpResponse } = require('../helpers');
const { InvalidRequestError } = require('../errors');
const { MissingParamError } = require('../../utils/errors');

class LoginRouter {
  constructor({ requestBodyValidator, loginUseCase } = {}) {
    this.requestBodyValidator = requestBodyValidator;
    this.loginUseCase = loginUseCase;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new MissingParamError('body');

      const errors = this.requestBodyValidator.validate(httpRequest.body);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const authenticationModel = await this.loginUseCase.handler(httpRequest.body);
      if (!authenticationModel) return HttpResponse.unauthorized();

      return HttpResponse.ok(authenticationModel);
    } catch (error) {
      console.error(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

module.exports = LoginRouter;
