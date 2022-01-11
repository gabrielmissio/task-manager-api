class HttpResponse {
  static ok(data) {
    return {
      statusCode: 200,
      body: data
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
    test('Then I expect it returns the body with the expected value', () => {
      expect(response.body).toBe(data);
    });
  });
});
