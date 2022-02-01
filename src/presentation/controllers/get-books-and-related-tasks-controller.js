const { HttpResponse } = require('../helpers');
const { InvalidRequestError, NotFoundError } = require('../errors');
const {
  ErrorMessagesEnum: { USER_NOT_FOUND }
} = require('../../utils/enums');

class GetBooksAndRelatedTasksController {
  constructor({
    requestParamsValidator,
    checkIfUserExistService,
    checkIfRequestIsAllowedService,
    getBooksAndRelatedTasksService
  } = {}) {
    this.requestParamsValidator = requestParamsValidator;
    this.checkIfUserExistService = checkIfUserExistService;
    this.checkIfRequestIsAllowedService = checkIfRequestIsAllowedService;
    this.getBooksAndRelatedTasksService = getBooksAndRelatedTasksService;
  }

  async handler(httpRequest) {
    try {
      const errors = this.requestParamsValidator.validate(httpRequest.params);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const userExist = await this.checkIfUserExistService.handler(httpRequest.params);
      if (!userExist) return HttpResponse.notFound(new NotFoundError(USER_NOT_FOUND));

      const isAllowed = this.checkIfRequestIsAllowed(httpRequest);
      if (!isAllowed) return HttpResponse.forbidden();

      const booksAndRelatedTasksModel = await this.getBooksAndRelatedTasksService.handler(httpRequest.params);
      return HttpResponse.ok(booksAndRelatedTasksModel);
    } catch (error) {
      console.log(error);
      return HttpResponse.exceptionHandler(error);
    }
  }

  checkIfRequestIsAllowed({ params, headers }) {
    return this.checkIfRequestIsAllowedService.handler({
      userId: params.userId,
      token: headers.authorization
    });
  }
}

module.exports = GetBooksAndRelatedTasksController;
