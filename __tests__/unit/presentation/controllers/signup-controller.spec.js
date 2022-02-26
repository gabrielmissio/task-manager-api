const { InternalServerError, InvalidRequestError, ConflictError } = require('../../../../src/presentation/errors');
const { MissingParamError } = require('../../../../src/utils/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');
const {
  ErrorMessagesEnum: { USER_ALREADY_EXISTS }
} = require('../../../../src/utils/enums');
const { DataFakerHelper } = require('../../../helpers');

class SignupController {
  constructor({ requestBodyValidator, checkIfUserExistService, signupService } = {}) {
    this.requestBodyValidator = requestBodyValidator;
    this.checkIfUserExistService = checkIfUserExistService;
    this.signupService = signupService;
  }

  async handler(httpRequest) {
    try {
      if (!httpRequest.body) throw new MissingParamError('body');

      const errors = this.requestBodyValidator.validate(httpRequest.body);
      if (errors) return HttpResponse.badRequest(new InvalidRequestError(errors));

      const userExist = await this.checkIfUserExistService.handler(httpRequest.body);
      if (userExist) return HttpResponse.conflict(new ConflictError(USER_ALREADY_EXISTS));

      await this.signupService.handler();

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

  describe('And the handler method of checkIfUserExistService dependency returns an user', () => {
    let response;
    beforeAll(async () => {
      const { sut, checkIfUserExistServiceSpy } = makeSut();
      checkIfUserExistServiceSpy.response = DataFakerHelper.getObject();
      response = await sut.handler({ body: {} });
    });

    test('Then I expect it returns statusCode 409', () => {
      expect(response.statusCode).toBe(409);
    });

    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new ConflictError(USER_ALREADY_EXISTS).message });
    });
  });

  describe('And the SignupService dependency is not injected', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy, checkIfUserExistServiceSpy } = makeSut();
      const sut = new SignupController({
        requestBodyValidator: requestBodyValidatorSpy,
        checkIfUserExistService: checkIfUserExistServiceSpy
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

  describe('And the SignupService dependency has no handler method', () => {
    let response;
    beforeAll(async () => {
      const { requestBodyValidatorSpy, checkIfUserExistServiceSpy } = makeSut();
      const sut = new SignupController({
        requestBodyValidator: requestBodyValidatorSpy,
        checkIfUserExistService: checkIfUserExistServiceSpy,
        signupService: {}
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
});
