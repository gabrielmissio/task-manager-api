const { HttpResponse } = require('../helpers');
const { InvalidRequestError, NotFoundError } = require('../errors');
const { MissingParamError } = require('../../utils/errors');
const {
  ErrorMessagesEnum: { USER_NOT_FOUND }
} = require('../../utils/enums');

class GetBooksAndRelatedTasksController {
  constructor({ requestParamsValidator, checkIfRequestIsAllowedService, getBooksAndRelatedTasksService } = {}) {
    this.requestParamsValidator = requestParamsValidator;
    this.checkIfRequestIsAllowedService = checkIfRequestIsAllowedService;
    this.getBooksAndRelatedTasksService = getBooksAndRelatedTasksService;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.params) throw new MissingParamError('params');

      const errors = this.requestParamsValidator.validate(httpRequest.params);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const isAllowed = this.checkIfRequestIsAllowedService.handler({
        userId: httpRequest.params.userId,
        authorization: httpRequest.headers.authorization
      });
      if (!isAllowed) return HttpResponse.forbidden();

      const booksAndRelatedTasksModel = await this.getBooksAndRelatedTasksService.handler({
        userId: httpRequest.params.userId
      });
      if (!booksAndRelatedTasksModel) return HttpResponse.notFound(new NotFoundError(USER_NOT_FOUND));

      return HttpResponse.ok(booksAndRelatedTasksModel);
    } catch (error) {
      console.log(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

module.exports = GetBooksAndRelatedTasksController;
