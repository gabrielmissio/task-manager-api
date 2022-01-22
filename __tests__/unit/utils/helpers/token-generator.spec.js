const JWT = require('jsonwebtoken');

const { MissingParamError } = require('../../../../src/utils/errors');

class TokenGenerator {
  constructor({ secret } = {}) {
    this.secret = secret;
  }

  async generate({ value } = {}) {
    if (!this.secret) throw new MissingParamError('secret');
    if (!value) throw new MissingParamError('value');

    const token = JWT.sign({ id: value }, this.secret);
    return token;
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

  describe('And JWT returns null', () => {
    test('Then I expect it returns null', async () => {
      JWT.token = null;
      const { sut } = makeSut();
      const token = await sut.generate({ value: 'any_value' });

      expect(token).toBeNull();
    });
  });

  describe('And JWT returns a token', () => {
    test('Then I expect it returns the token returned by the sign method of the JWT dependency', async () => {
      const { sut } = makeSut();
      const token = await sut.generate({ value: 'any_value' });

      expect(token).toEqual(JWT.token);
    });
  });
});
