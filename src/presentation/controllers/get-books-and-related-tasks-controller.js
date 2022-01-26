const { HttpResponse } = require('../helpers');
const { InvalidRequestError, NotFoundError } = require('../errors');
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
      const errors = this.requestParamsValidator.validate(httpRequest.params);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const isAllowed = this.checkIfRequestIsAllowed({ headers: httpRequest.headers, params: httpRequest.params });
      if (!isAllowed) return HttpResponse.forbidden();

      const booksAndRelatedTasksModel = await this.getBooksAndRelatedTasksModel({ params: httpRequest.params });
      if (!booksAndRelatedTasksModel) return HttpResponse.notFound(new NotFoundError(USER_NOT_FOUND));

      return HttpResponse.ok(booksAndRelatedTasksModel);
    } catch (error) {
      console.log(error);
      return HttpResponse.exceptionHandler(error);
    }
  }

  checkIfRequestIsAllowed({ params, headers }) {
    return this.checkIfRequestIsAllowedService.handler({
      userId: params.userId,
      authorization: headers.authorization
    });
  }

  async getBooksAndRelatedTasksModel({ params }) {
    return this.getBooksAndRelatedTasksService.handler({
      userId: params.userId
    });
  }
}

module.exports = GetBooksAndRelatedTasksController;
