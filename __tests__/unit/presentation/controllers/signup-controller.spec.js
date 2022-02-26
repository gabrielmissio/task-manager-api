const { InternalServerError, InvalidRequestError } = require('../../../../src/presentation/errors');
const { MissingParamError } = require('../../../../src/utils/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');
const { DataFakerHelper } = require('../../../helpers');

class SignupController {
  constructor({ requestBodyValidator, checkIfUserExistService } = {}) {
    this.requestBodyValidator = requestBodyValidator;
    this.checkIfUserExistService = checkIfUserExistService;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new MissingParamError('body');

      const errors = this.requestBodyValidator.validate(httpRequest.body);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      await this.checkIfUserExistService.handler(httpRequest.body);

      return 0;
    } catch (error) {
      console.error(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

const makerequestBodyValidatorSpy = () => {
  class RequestBodyValidatorSpy {
    validate(params) {
      this.params = params;
      return this.response;
    }
  }

  return new RequestBodyValidatorSpy();
};

const makeCheckIfUserExistServiceSpy = () => {
  class CheckIfUserExistServiceSpy {
    async handler(params) {
      this.params = params;
      return this.response;
    }
  }

  return new CheckIfUserExistServiceSpy();
};

const makeSut = () => {
  const requestBodyValidatorSpy = makerequestBodyValidatorSpy();
  requestBodyValidatorSpy.response = null;

  const checkIfUserExistServiceSpy = makeCheckIfUserExistServiceSpy();
  checkIfUserExistServiceSpy.response = null;

  const sut = new SignupController({
    requestBodyValidator: requestBodyValidatorSpy,
    checkIfUserExistService: checkIfUserExistServiceSpy
  });

  return {
    sut,
    requestBodyValidatorSpy,
    checkIfUserExistServiceSpy
  };
};

describe('Given the SignupController', () => {
  describe('And no httpRequest is provided', () => {
    let response;
    beforeAll(async () => {
      const { sut } = makeSut();
      response = await sut.handler();
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And httpRequest has no body', () => {
    let response;
    beforeAll(async () => {
      const { sut } = makeSut();
      response = await sut.handler({});
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestBodyValidator dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const sut = new SignupController();
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestBodyValidator dependency has no validate method', () => {
    let response;
    beforeAll(async () => {
      const sut = new SignupController({ requestBodyValidator: {} });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the requestBodyValidator dependency is injected correctly', () => {
    test('Then I expect it calls the validate method with the expected params', async () => {
      const { sut, requestBodyValidatorSpy } = makeSut();
      const request = { body: DataFakerHelper.getString() };

      await sut.handler(request);

      expect(requestBodyValidatorSpy.params).toEqual(request.body);
    });
  });

  describe('And the validate method of requestBodyValidator dependency returns an error', () => {
    let response;
    const errorMessage = DataFakerHelper.getSentence({ words: 3 });

    beforeAll(async () => {
      const { sut, requestBodyValidatorSpy } = makeSut();
      requestBodyValidatorSpy.response = errorMessage;
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 400', () => {
      expect(response.statusCode).toBe(400);
    });
    test('Then I expect it returns the body with a message indicating the error', () => {
      expect(response.body).toEqual({ error: new InvalidRequestError(errorMessage).message });
    });
  });

  describe('And the checkIfUserExistService dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new SignupController({ requestBodyValidator: requestBodyValidatorSpy });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the checkIfUserExistService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new SignupController({
        requestBodyValidator: requestBodyValidatorSpy,
        checkIfUserExistService: {}
      });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the checkIfUserExistService dependency is injected correctly', () => {
    test('Then I expect it calls the validate method with the expected params', async () => {
      const { sut, checkIfUserExistServiceSpy } = makeSut();
      const request = { body: DataFakerHelper.getString() };

      await sut.handler(request);

      expect(checkIfUserExistServiceSpy.params).toEqual(request.body);
    });
  });
});
