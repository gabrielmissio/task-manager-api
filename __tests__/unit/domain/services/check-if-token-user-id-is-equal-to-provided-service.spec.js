const { MissingParamError } = require('../../../../src/utils/errors');

class CheckIfTokenUserIdIsEqualToProvidedService {
  handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    throw new MissingParamError('token');
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
      const params = {};
      const response = () => sut.handler(params);

      expect(response).toThrow(new MissingParamError('userId'));
    });
  });

  describe('And no token is provided', () => {
    test('Then I expect it throws a new MissingParamError', () => {
      const { sut } = makeSut();
      const params = { userId: 'any_id' };
      const response = () => sut.handler(params);

      expect(response).toThrow(new MissingParamError('token'));
    });
  });
});
