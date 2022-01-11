const { HttpResponse } = require('../../../../src/presentation/helpers');

class LoginRouter {
  constructor({ requestBodyValidator } = {}) {
    this.requestBodyValidator = requestBodyValidator;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new Error();
      this.requestBodyValidator.validate(httpRequest.body);

      return true;
    } catch (error) {
      return HttpResponse.exceptionHandler(error);
    }
  }
}

const makeRequestValidatorSpy = () => {
  class RequestBodyValidatorSpy {
    validate() {
      return {};
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
});
