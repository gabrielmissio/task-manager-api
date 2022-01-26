const { MissingParamError } = require('../../../../src/utils/errors');

class CheckIfTokenUserIdIsEqualToProvidedService {
  handler({ userId, token }) {
    if (!userId) throw new MissingParamError('userId');
    if (!token) throw new MissingParamError('token');

    this.tokenDecoder.decode();
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

  describe('And the tokenDecoder dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new CheckIfTokenUserIdIsEqualToProvidedService();
      const params = {
        userId: 'any_email',
        token: 'any_token'
      };

      const response = () => sut.handler(params);

      expect(response).toThrow(new Error("Cannot read property 'decode' of undefined"));
    });
  });
});
