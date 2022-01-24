const { MissingParamError } = require('../../../../src/utils/errors');
const { InternalServerError, InvalidRequestError } = require('../../../../src/presentation/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');
const { DataFakerHelper } = require('../../../helpers');

class GetBooksAndRelatedTasksController {
  constructor({ requestParamsValidator, checkIfUserExistsService } = {}) {
    this.requestParamsValidator = requestParamsValidator;
    this.checkIfUserExistsService = checkIfUserExistsService;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.params) throw new MissingParamError('params');

      const errors = this.requestParamsValidator.validate(httpRequest.params);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      await this.checkIfUserExistsService.handler({ userId: httpRequest.params.userId });
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

const makeCheckIfUserExistsServiceSpy = () => {
  class CheckIfUserExistsServiceSpy {
    handler({ userId }) {
      this.params = userId;
      return this.response;
    }
  }

  return new CheckIfUserExistsServiceSpy();
};

const makeSut = () => {
  const requestParamsValidatorSpy = makeRequestParamsValidatorSpy();
  requestParamsValidatorSpy.response = null;

  const checkIfUserExistsServiceSpy = makeCheckIfUserExistsServiceSpy();
  this.response = DataFakerHelper.getObject();

  const sut = new GetBooksAndRelatedTasksController({
    requestParamsValidator: requestParamsValidatorSpy,
    checkIfUserExistsService: checkIfUserExistsServiceSpy
  });

  return {
    sut,
    requestParamsValidatorSpy,
    checkIfUserExistsServiceSpy
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

  describe('And the checkIfUserExistsService dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({ requestParamsValidator: requestParamsValidatorSpy });
      response = await sut.handler({ params: { userId: 'any_uuid' } });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the checkIfUserExistsService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestParamsValidatorSpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksController({
        requestParamsValidator: requestParamsValidatorSpy,
        checkIfUserExistsService: {}
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

  describe('And the checkIfUserExistsService dependency is injected and has the handler method', () => {
    test('Then I expect it calls the handler method of checkIfUserExistsService dependency with the expected params', async () => {
      const { sut, checkIfUserExistsServiceSpy } = makeSut();
      const request = { params: { userId: DataFakerHelper.getUUID() } };

      await sut.handler(request);
      expect(checkIfUserExistsServiceSpy.params).toBe(request.params.userId);
    });
  });
});
