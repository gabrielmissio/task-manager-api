const { HttpResponse } = require('../helpers');
const { InvalidRequestError, ConflictError } = require('../errors');
const { MissingParamError } = require('../../utils/errors');
const {
  ErrorMessagesEnum: { USER_ALREADY_EXISTS }
} = require('../../utils/enums');

class SignupController {
  constructor({ requestBodyValidator, checkIfUserExistService, signupService } = {}) {
    this.requestBodyValidator = requestBodyValidator;
    this.checkIfUserExistService = checkIfUserExistService;
    this.signupService = signupService;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new MissingParamError('body');

      const errors = this.requestBodyValidator.validate(httpRequest.body);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const userExist = await this.checkIfUserExistService.handler(httpRequest.body);
      if (userExist) return HttpResponse.conflict(new ConflictError(USER_ALREADY_EXISTS));

      const newUser = await this.signupService.handler(httpRequest.body);
      return HttpResponse.created(newUser);
    } catch (error) {
      console.error(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

module.exports = SignupController;
