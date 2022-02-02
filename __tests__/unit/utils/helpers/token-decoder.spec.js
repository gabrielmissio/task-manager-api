const { MissingParamError, InvalidParamError } = require('../../../../src/utils/errors');
const { TokenGenerator, TokenDecoder } = require('../../../../src/utils/helpers');
const { DataFakerHelper } = require('../../../helpers');

jest.unmock('jsonwebtoken');

const makeSut = () => {
  const sut = new TokenDecoder();

  return { sut };
};

describe('Given the TokenDecoder', () => {
  describe('And no token is provided', () => {
    test('Then I expect it returns a new MissingParamError', () => {
      const { sut } = makeSut();
      const response = () => sut.decode();

      expect(response).toThrow(new MissingParamError('token'));
    });
  });

  describe('And an invalid token is provided', () => {
    test('Then I expect it returns a new InvalidParamError', () => {
      const { sut } = makeSut();
      const invalidToken = DataFakerHelper.getString();
      const response = () => sut.decode({ token: invalidToken });

      expect(response).toThrow(new InvalidParamError('token'));
    });
  });

  describe('And a valid token is provided', () => {
    test('Then I expect it returns the decoded token payload', async () => {
      const { sut } = makeSut();
      const payload = { userId: DataFakerHelper.getUUID() };
      const tokenGenerator = new TokenGenerator({ secret: 'secret' });
      const token = await tokenGenerator.generate({ value: payload.userId });

      const response = sut.decode({ token });
      delete response.iat;

      expect(response).toEqual(payload);
    });
  });
});
