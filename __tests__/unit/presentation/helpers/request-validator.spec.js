const { MissingParamError } = require('../../../../src/utils/errors');

class RequestValidator {
  validate() {
    throw new MissingParamError('params');
  }
}

const makeSut = () => {
  const sut = new RequestValidator();
  return {
    sut
  };
};

describe('Given the RequestValidator', () => {
  describe('And no parameter was provided for validate method', () => {
    test('Then a expect it throws an MissingParamError error ', () => {
      const { sut } = makeSut();
      const response = () => sut.validate();

      expect(response).toThrow(new MissingParamError('params'));
    });
  });
});
