const { HttpResponse } = require('../../../../src/presentation/helpers');
const { InvalidRequestError, InternalServerError, UnauthorizedError } = require('../../../../src/presentation/errors');

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

      const authenticationModel = await this.loginUseCase.handler(httpRequest.body);
      if (!authenticationModel) return HttpResponse.unauthorized();

      return authenticationModel;
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

const makeLoginUseCaseSpy = () => {
  class LoginUseCaseSpy {
    async handler(params) {
      this.params = params;
      return this.response;
    }
  }

  return new LoginUseCaseSpy();
};

const makeSut = () => {
  const requestBodyValidatorSpy = makeRequestValidatorSpy();
  const loginUseCaseSpy = makeLoginUseCaseSpy();
  requestBodyValidatorSpy.response = null;
  loginUseCaseSpy.response = 'any authentication model';
  const sut = new LoginRouter({
    requestBodyValidator: requestBodyValidatorSpy,
    loginUseCase: loginUseCaseSpy
  });
  return {
    sut,
    requestBodyValidatorSpy,
    loginUseCaseSpy
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
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toBe(new InternalServerError().message);
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
      expect(response.body).toBe(new InternalServerError().message);
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

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toBe(new InternalServerError().message);
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

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toBe(new InternalServerError().message);
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

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toBe(new InternalServerError().message);
    });
  });

  describe('And the loginUseCase dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new LoginRouter({ requestBodyValidator: requestBodyValidatorSpy, loginUseCase: {} });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toBe(new InternalServerError().message);
    });
  });

  describe('And the loginUseCase dependency was injected and has the handler method', () => {
    test('Then I expect it calls the handler method from loginUseCase dependency with the expected params', async () => {
      const { sut, loginUseCaseSpy } = makeSut();
      const requestBody = 'any_params';

      await sut.handler({ body: requestBody });
      expect(loginUseCaseSpy.params).toBe(requestBody);
    });
  });

  describe('And the handler method from loginUseCase dependency does not return any authenticationModel', () => {
    let response;
    beforeAll(async () => {
      const { sut, loginUseCaseSpy } = makeSut();
      loginUseCaseSpy.response = null;
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 401', () => {
      expect(response.statusCode).toBe(401);
    });
    test('Then I expect it returns the body with UnauthorizedError message', () => {
      expect(response.body).toBe(new UnauthorizedError().message);
    });
  });
});
