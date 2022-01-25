const { MissingParamError } = require('../../../../src/utils/errors');
const {
  InternalServerError,
  InvalidRequestError,
  NotFoundError,
  ForbiddenError
} = require('../../../../src/presentation/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');
const {
  ErrorMessagesEnum: { USER_NOT_FOUND }
} = require('../../../../src/utils/enums');
const { DataFakerHelper } = require('../../../helpers');

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

      return true;
    } catch (error) {
      console.log(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

const makeRequestParamsValidatorSpy = () => {
  class RequestParamsValidatorSpy {
    validate(params) {
      this.params = params;
      return this.response;
    }
  }

  return new RequestParamsValidatorSpy();
};

const makeCheckIfRequestIsAllowedServiceSpy = () => {
  class CheckIfRequestIsAllowedServiceSpy {
    handler({ userId, authorization }) {
      this.params = { userId, authorization };
      return this.response;
    }
  }

  return new CheckIfRequestIsAllowedServiceSpy();
};

const makeGetBooksAndRelatedTasksServiceSpy = () => {
  class GetBooksAndRelatedTasksServiceSpy {
    async handler({ userId }) {
      this.params = userId;
      return this.response;
    }
  }

  return new GetBooksAndRelatedTasksServiceSpy();
};

const makeSut = () => {
  const requestParamsValidatorSpy = makeRequestParamsValidatorSpy();
  requestParamsValidatorSpy.response = null;

  const checkIfRequestIsAllowedServiceSpy = makeCheckIfRequestIsAllowedServiceSpy();
  checkIfRequestIsAllowedServiceSpy.response = true;

  const getBooksAndRelatedTasksServiceSpy = makeGetBooksAndRelatedTasksServiceSpy();
  getBooksAndRelatedTasksServiceSpy.response = DataFakerHelper.getObject();

  const sut = new GetBooksAndRelatedTasksController({
    requestParamsValidator: requestParamsValidatorSpy,
    checkIfRequestIsAllowedService: checkIfRequestIsAllowedServiceSpy,
    getBooksAndRelatedTasksService: getBooksAndRelatedTasksServiceSpy
  });

  return {
    sut,
    requestParamsValidatorSpy,
    checkIfRequestIsAllowedServiceSpy,
    getBooksAndRelatedTasksServiceSpy
  };
};

describe('Given the GetBooksAndRelatedTasksController', () => {
  describe('And httpRequest has no params', () => {
    let response;
    beforeAll(async () => {
      const { sut } = makeSut();
      response = await sut.handler({});
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestParamsValidator dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const sut = new GetBooksAndRelatedTasksController();
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestParamsValidator dependency has no validate method', () => {
    let response;
    beforeAll(async () => {
      const sut = new GetBooksAndRelatedTasksController({ requestParamsValidator: {} });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestParamsValidator dependency is injected and has the validate method', () => {
    test('Then I expect it calls the validate method of requestParamsValidator dependency with the expected params', async () => {
      const { sut, requestParamsValidatorSpy } = makeSut();
      const request = { params: { userId: DataFakerHelper.getUUID() } };

      await sut.handler(request);
      expect(requestParamsValidatorSpy.params).toBe(request.params);
    });
  });

  describe('And the validate method of requestParamsValidator dependency returns some error', () => {
    let response;
    const errorMessage = DataFakerHelper.getSentence({ words: 3 });

    beforeAll(async () => {
      const { sut, requestParamsValidatorSpy } = makeSut();
      requestParamsValidatorSpy.response = errorMessage;
      response = await sut.handler({ params: {} });
    });

    test('Then I expect it returns statusCode 400', () => {
      expect(response.statusCode).toBe(400);
    });
    test('Then I expect it returns the body with a message indicating the error', () => {
      expect(response.body).toEqual({ error: new InvalidRequestError(errorMessage).message });
    });
  });

  describe('And the checkIfRequestIsAllowedService dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({
        requestParamsValidator: requestParamsValidatorSpy
      });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the checkIfRequestIsAllowedService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({
        requestParamsValidator: requestParamsValidatorSpy,
        checkIfRequestIsAllowedService: {}
      });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the checkIfRequestIsAllowedService dependency is injected and has the handler method', () => {
    test('Then I expect it calls the handler method of checkIfRequestIsAllowedService dependency with the expected params', async () => {
      const { sut, checkIfRequestIsAllowedServiceSpy } = makeSut();
      const request = {
        params: { userId: DataFakerHelper.getUUID() },
        headers: { authorization: DataFakerHelper.getString() }
      };
      await sut.handler(request);
      expect(checkIfRequestIsAllowedServiceSpy.params.userId).toBe(request.params.userId);
      expect(checkIfRequestIsAllowedServiceSpy.params.authorization).toBe(request.headers.authorization);
    });
  });

  describe('And the handler method of checkIfRequestIsAllowedService dependency returns false', () => {
    let response;

    beforeAll(async () => {
      const { sut, checkIfRequestIsAllowedServiceSpy } = makeSut();
      checkIfRequestIsAllowedServiceSpy.response = false;
      response = await sut.handler({ params: {}, headers: {} });
    });

    test('Then I expect it returns statusCode 403', () => {
      expect(response.statusCode).toBe(403);
    });
    test('Then I expect it returns the body with a message indicating the error', () => {
      expect(response.body).toEqual({ error: new ForbiddenError().message });
    });
  });

  describe('And the getBooksAndRelatedTasksService dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy, checkIfRequestIsAllowedServiceSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({
        requestParamsValidator: requestParamsValidatorSpy,
        checkIfRequestIsAllowedService: checkIfRequestIsAllowedServiceSpy
      });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the getBooksAndRelatedTasksService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy, checkIfRequestIsAllowedServiceSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({
        requestParamsValidator: requestParamsValidatorSpy,
        checkIfRequestIsAllowedService: checkIfRequestIsAllowedServiceSpy,
        getBooksAndRelatedTasksService: {}
      });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the getBooksAndRelatedTasksService dependency is injected and has the handler method', () => {
    test('Then I expect it calls the handler method of getBooksAndRelatedTasksService dependency with the expected params', async () => {
      const { sut, getBooksAndRelatedTasksServiceSpy } = makeSut();
      const request = { params: { userId: DataFakerHelper.getUUID() }, headers: {} };

      await sut.handler(request);
      expect(getBooksAndRelatedTasksServiceSpy.params).toBe(request.params.userId);
    });
  });

  describe('And the handler method of getBooksAndRelatedTasksService dependency returns null', () => {
    let response;

    beforeAll(async () => {
      const { sut, getBooksAndRelatedTasksServiceSpy } = makeSut();
      getBooksAndRelatedTasksServiceSpy.response = null;
      response = await sut.handler({ params: {}, headers: {} });
    });

    test('Then I expect it returns statusCode 404', () => {
      expect(response.statusCode).toBe(404);
    });
    test('Then I expect it returns the body with a message indicating the error', () => {
      expect(response.body).toEqual({ error: new NotFoundError(USER_NOT_FOUND).message });
    });
  });
});
