const { HttpResponse } = require('../../../../src/presentation/helpers');

class LoginRouter {
  async handler() {
    return HttpResponse.exceptionHandler({});
  }
}

const makeSut = () => {
  const sut = new LoginRouter();
  return {
    sut
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
});
