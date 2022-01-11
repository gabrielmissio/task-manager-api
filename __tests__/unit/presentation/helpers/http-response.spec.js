const { HttpResponse } = require('../../../../src/presentation/helpers');
const { InternalServerError } = require('../../../../src/presentation/errors');

const makeSut = () => {
  const sut = HttpResponse;
  return {
    sut
  };
};

describe('Given the HttpResponse', () => {
  describe('And the ok method is called', () => {
    let response;
    const data = { foo: 'bar' };
    beforeAll(() => {
      const { sut } = makeSut();
      response = sut.ok(data);
    });

    test('Then I expect it returns statusCode 200', () => {
      expect(response.statusCode).toBe(200);
    });
    test('Then I expect it returns the body with the provided value', () => {
      expect(response.body).toBe(data);
    });
  });

  describe('And the badRequest method is called', () => {
    let response;
    const error = { message: 'any error message' };
    beforeAll(() => {
      const { sut } = makeSut();
      response = sut.badRequest(error);
    });

    test('Then I expect it returns statusCode 400', () => {
      expect(response.statusCode).toBe(400);
    });
    test('Then I expect it returns the body with the provided error message', () => {
      expect(response.body).toBe(error.message);
    });
  });

  describe('And the exceptionHandler method is called', () => {
    describe('And statusCode and error message are provided', () => {
      let response;
      const error = { description: 'any error message', statusCode: 666 };
      beforeAll(() => {
        const { sut } = makeSut();
        response = sut.exceptionHandler(error);
      });
      test('Them I expect it returns the provided statusCode', () => {
        expect(response.statusCode).toBe(666);
      });
      test('Then I expect it returns the body with the provided error message', () => {
        expect(response.body).toBe(error.description);
      });
    });

    describe('And no statusCode and error message are provided', () => {
      let response;
      beforeAll(() => {
        const { sut } = makeSut();
        response = sut.exceptionHandler({});
      });
      test('Then I expect it returns statusCode 500', () => {
        expect(response.statusCode).toBe(500);
      });
      test('Then I expect it returns the body with Internal Server Error message', () => {
        expect(response.body).toBe(new InternalServerError().message);
      });
    });
  });
});
