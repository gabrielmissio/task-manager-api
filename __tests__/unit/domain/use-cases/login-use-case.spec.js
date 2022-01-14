const { MissingParamError } = require('../../../../src/utils/errors');

class LoginUseCase {
  async handler() {
    throw new MissingParamError('email');
  }
}

const makeSut = () => {
  const sut = new LoginUseCase();

  return {
    sut
  };
};

describe('Given the LoginUseCase', () => {
  describe('And no email is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.handler();

      expect(promise).rejects.toThrow(new MissingParamError('email'));
    });
  });
});
