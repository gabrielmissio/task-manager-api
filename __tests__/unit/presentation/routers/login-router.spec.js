const { HttpResponse } = require('../../../../src/presentation/helpers');
const { InvalidRequestError } = require('../../../../src/presentation/errors');

class LoginRouter {
  constructor({ requestBodyValidator, loginUseCase } = {}) {
    this.requestBodyValidator = requestBodyValidator;
    this.loginUseCase = loginUseCase;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new Error();

      const errors = this.requestBodyValidator.validate(httpRequest.body);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      this.loginUseCase.handler();

      return true;
    } catch (error) {
      console.error(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

const makeRequestValidatorSpy = () => {
  class RequestBodyValidatorSpy {
    validate(params) {
      this.params = params;
      return this.response;
    }
  }

  return new RequestBodyValidatorSpy();
};

const makeSut = () => {
  const requestBodyValidatorSpy = makeRequestValidatorSpy();
  const sut = new LoginRouter({ requestBodyValidator: requestBodyValidatorSpy });
  return {
    sut,
    requestBodyValidatorSpy
  };
};

describe('Given the LoginRouter', () => {
  describe('And no httpRequest is provided', () => {
    let response;
    beforeAll(async () => {
      const { sut } = makeSut();
      response = await sut.handler();
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with Internal Server Error message', () => {
      expect(response.body).toBe('Internal Server Error');
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
    test('Then I expect it returns the body with Internal Server Error message', () => {
      expect(response.body).toBe('Internal Server Error');
    });
  });

  describe('And the requestBodyValidator dependency was not injected', () => {
    let response;
    beforeAll(async () => {
      const sut = new LoginRouter();
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with Internal Server Error message', () => {
      expect(response.body).toBe('Internal Server Error');
    });
  });

  describe('And the requestBodyValidator dependency has no validate method', () => {
    let response;
    beforeAll(async () => {
      const sut = new LoginRouter({ requestBodyValidator: {} });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with Internal Server Error message', () => {
      expect(response.body).toBe('Internal Server Error');
    });
  });

  describe('And the requestBodyValidator dependency was injected and has the validate method', () => {
    test('Then I expect it calls the validate method from requestBodyValidator dependency with the expected params', async () => {
      const { sut, requestBodyValidatorSpy } = makeSut();
      const requestBody = 'any_params';

      await sut.handler({ body: requestBody });
      expect(requestBodyValidatorSpy.params).toBe(requestBody);
    });
  });

  describe('And the validate method from requestBodyValidator dependency returns any error', () => {
    let response;
    const errorMessage = 'any_error';

    beforeAll(async () => {
      const { sut, requestBodyValidatorSpy } = makeSut();
      requestBodyValidatorSpy.response = errorMessage;
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 400', () => {
      expect(response.statusCode).toBe(400);
    });
    test('Then I expect it returns the body with a message indicating the error', () => {
      expect(response.body).toBe(new InvalidRequestError(errorMessage).message);
    });
  });

  describe('And the loginUseCase dependency was not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new LoginRouter({ requestBodyValidator: requestBodyValidatorSpy });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with Internal Server Error message', () => {
      expect(response.body).toBe('Internal Server Error');
    });
  });
});
