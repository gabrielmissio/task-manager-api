const { MissingParamError } = require('../../../../src/utils/errors');

class TokenGenerator {
  constructor({ secret } = {}) {
    this.secret = secret;
  }

  async generate() {
    if (!this.secret) throw new MissingParamError('secret');
    throw new MissingParamError('value');
  }
}

const makeSut = () => {
  const sut = new TokenGenerator({ secret: 'any_secret' });

  return { sut };
};

describe('Given the TokenGenerator', () => {
  describe('And the secret parameter was not injected', () => {
    test('Then I expect it throws a new MissinParamError', async () => {
      const sut = new TokenGenerator();
      const promise = sut.generate();

      await expect(promise).rejects.toThrow(new MissingParamError('secret'));
    });
  });

  describe('And no value is provided', () => {
    test('Then I expect it throws a new MissinParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.generate();

      await expect(promise).rejects.toThrow(new MissingParamError('value'));
    });
  });
});
