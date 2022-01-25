const { MissingParamError } = require('../../../../src/utils/errors');

class TokenDecoder {
  decode() {
    throw new MissingParamError('token');
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
});
