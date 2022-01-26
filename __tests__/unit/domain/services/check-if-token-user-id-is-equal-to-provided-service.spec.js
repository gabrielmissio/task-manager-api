const { MissingParamError } = require('../../../../src/utils/errors');

class CheckIfTokenUserIdIsEqualToProvidedService {
  handler() {
    throw new MissingParamError('userId');
  }
}

const makeSut = () => {
  const sut = new CheckIfTokenUserIdIsEqualToProvidedService();

  return { sut };
};

describe('Given the CheckIfTokenUserIdIsEqualToProvidedService', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a new MissingParamError', () => {
      const { sut } = makeSut();
      const response = () => sut.handler();

      expect(response).toThrow(new MissingParamError('userId'));
    });
  });
});
