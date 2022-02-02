const JWT = require('jsonwebtoken');

const { TokenGenerator } = require('../../../../src/utils/helpers');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

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

  describe('And calls sign method of JWT dependency', () => {
    test('Then I expect it calls sign method with expected params', async () => {
      const { sut } = makeSut();
      const userId = DataFakerHelper.getUUID();
      await sut.generate({ value: userId });

      expect(JWT.value).toEqual({ userId });
      expect(JWT.secret).toBe(sut.secret);
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
