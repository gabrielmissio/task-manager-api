const { MissingParamError } = require('../../../../src/utils/errors');

class LoginUseCase {
  async handler({ email }) {
    if (!email) throw new MissingParamError('email');
    throw new MissingParamError('password');
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
      const promise = sut.handler({});

      await expect(promise).rejects.toThrow(new MissingParamError('email'));
    });
  });

  describe('And no password is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const params = { email: 'any' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('password'));
    });
  });
});
