const { MissingParamError } = require('../../../../src/utils/errors');
const { InternalServerError } = require('../../../../src/presentation/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');
const { DataFakerHelper } = require('../../../helpers');

class GetBooksAndRelatedTasksController {
  constructor({ requestParamsValidator } = {}) {
    this.requestParamsValidator = requestParamsValidator;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.params) throw new MissingParamError('params');
      return this.requestParamsValidator.validate(httpRequest.params);
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

const makeSut = () => {
  const requestParamsValidatorSpy = makeRequestParamsValidatorSpy();
  requestParamsValidatorSpy.response = null;

  const sut = new GetBooksAndRelatedTasksController({
    requestParamsValidator: requestParamsValidatorSpy
  });

  return {
    sut,
    requestParamsValidatorSpy
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
      response = await sut.handler({ params: 'any_uuid' });
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
      response = await sut.handler({ params: 'any_uuid' });
    });

    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestParamsValidator dependency is injected and has the validate method', () => {
    test('Then I expect it calls the validate method from requestParamsValidator dependency with the expected params', async () => {
      const { sut, requestParamsValidatorSpy } = makeSut();
      const request = { params: DataFakerHelper.getUUID() };

      await sut.handler(request);
      expect(requestParamsValidatorSpy.params).toBe(request.params);
    });
  });
});
