const { MissingParamError, InvalidParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class TokenDecoder {
  decode({ token } = {}) {
    if (!token) throw new MissingParamError('token');
    throw new InvalidParamError('token');
  }
}

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
});
