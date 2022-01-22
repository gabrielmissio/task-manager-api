const { InvalidRequestError, InternalServerError, UnauthorizedError } = require('../../../../src/presentation/errors');
const { LoginController } = require('../../../../src/presentation/controllers');

const makeRequestValidatorSpy = () => {
  class RequestBodyValidatorSpy {
    validate(params) {
      this.params = params;
      return this.response;
    }
  }

  return new RequestBodyValidatorSpy();
};

const makeLoginServiceSpy = () => {
  class LoginServiceSpy {
    async handler(params) {
      this.params = params;
      return this.response;
    }
  }

  return new LoginServiceSpy();
};

const makeSut = () => {
  const requestBodyValidatorSpy = makeRequestValidatorSpy();
  const loginServiceSpy = makeLoginServiceSpy();
  requestBodyValidatorSpy.response = null;
  loginServiceSpy.response = 'any authentication model';
  const sut = new LoginController({
    requestBodyValidator: requestBodyValidatorSpy,
    loginService: loginServiceSpy
  });
  return {
    sut,
    requestBodyValidatorSpy,
    loginServiceSpy
  };
};

describe('Given the LoginController', () => {
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

  describe('And the requestBodyValidator dependency was not injected', () => {
    let response;
    beforeAll(async () => {
      const sut = new LoginController();
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
      const sut = new LoginController({ requestBodyValidator: {} });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
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
      expect(response.body).toEqual({ error: new InvalidRequestError(errorMessage).message });
    });
  });

  describe('And the loginService dependency was not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new LoginController({ requestBodyValidator: requestBodyValidatorSpy });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the loginService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy } = makeSut();
      const sut = new LoginController({ requestBodyValidator: requestBodyValidatorSpy, loginService: {} });
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 500', () => {
      expect(response.statusCode).toBe(500);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });

  describe('And the loginService dependency was injected and has the handler method', () => {
    test('Then I expect it calls the handler method from loginService dependency with the expected params', async () => {
      const { sut, loginServiceSpy } = makeSut();
      const requestBody = 'any_params';

      await sut.handler({ body: requestBody });
      expect(loginServiceSpy.params).toBe(requestBody);
    });
  });

  describe('And the handler method from loginService dependency does not return any authenticationModel', () => {
    let response;
    beforeAll(async () => {
      const { sut, loginServiceSpy } = makeSut();
      loginServiceSpy.response = null;
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 401', () => {
      expect(response.statusCode).toBe(401);
    });
    test('Then I expect it returns the body with UnauthorizedError message', () => {
      expect(response.body).toEqual({ error: new UnauthorizedError().message });
    });
  });

  describe('And the handler method from loginService dependency returns a authenticationModel', () => {
    let response;
    let loginServiceResponse;
    beforeAll(async () => {
      const { sut, loginServiceSpy } = makeSut();
      response = await sut.handler({ body: {} });
      loginServiceResponse = loginServiceSpy.response;
    });
    test('Then I expect it returns statusCode 200', () => {
      expect(response.statusCode).toBe(200);
    });
    test('Then I expect it returns the body with the authenticationModel returned by handler method of the loginService dependency', () => {
      expect(response.body).toBe(loginServiceResponse);
    });
  });
});
