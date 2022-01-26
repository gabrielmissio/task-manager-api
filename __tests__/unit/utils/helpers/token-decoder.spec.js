const { MissingParamError, InvalidParamError } = require('../../../../src/utils/errors');
const { TokenGenerator } = require('../../../../src/utils/helpers');
const { DataFakerHelper } = require('../../../helpers');

class TokenDecoder {
  decode({ token } = {}) {
    if (!token) throw new MissingParamError('token');

    const splitedToken = token.split('.');
    const isValid = splitedToken.length === 3;
    if (!isValid) throw new InvalidParamError('token');

    const base64Payload = splitedToken[1].replace('-', '+').replace('_', '/');
    const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('binary'));

    return decodedPayload;
  }
}

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
      const payload = { id: DataFakerHelper.getUUID() };
      const tokenGenerator = new TokenGenerator({ secret: 'secret' });
      const token = await tokenGenerator.generate({ value: payload.id });

      const response = sut.decode({ token });
      delete response.iat;

      expect(response).toEqual(payload);
    });
  });
});
