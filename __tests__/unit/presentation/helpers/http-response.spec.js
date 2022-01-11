class HttpResponse {
  static ok(data) {
    return {
      statusCode: 200,
      body: data
    };
  }

  static badRequest(error) {
    return {
      statusCode: 400,
      body: error.message
    };
  }

  static exceptionHandler(error) {
    return {
      statusCode: error.statusCode,
      body: error.message
    };
  }
}

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
    beforeAll(async () => {
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
    beforeAll(async () => {
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
      const error = { message: 'any error message', statusCode: 666 };
      beforeAll(async () => {
        const { sut } = makeSut();
        response = sut.exceptionHandler(error);
      });
      test('Them I expect it returns the provided statusCode', () => {
        expect(response.statusCode).toBe(666);
      });
      test('Then I expect it returns the body with the provided error message', () => {
        expect(response.body).toBe(error.message);
      });
    });
  });
});
