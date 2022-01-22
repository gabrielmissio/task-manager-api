const { MissingParamError } = require('../../../../src/utils/errors');

class TokenGenerator {
  async generate() {
    throw new MissingParamError('secret');
  }
}

const makeSut = () => {
  const sut = new TokenGenerator();

  return { sut };
};

describe('Given the TokenGenerator', () => {
  describe('And the secret parameter was not injected', () => {
    test('Then I expect it throws a new MissinParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.generate();

      await expect(promise).rejects.toThrow(new MissingParamError('secret'));
    });
  });
});
