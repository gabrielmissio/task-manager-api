const { MissingParamError } = require('../../../../src/utils/errors');

class LoginUseCase {
  constructor({ userRepository } = {}) {
    this.userRepository = userRepository;
  }

  async handler({ email, password }) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    this.userRepository.getByEmail();
  }
}

const makeUserRepositorySpy = () => {
  class UserRepositorySpy {
    async getByEmail({ email }) {
      this.email = email;
      return this.response;
    }
  }

  return new UserRepositorySpy();
};

const makeSut = () => {
  const userRepositorySpy = makeUserRepositorySpy();
  const sut = new LoginUseCase({ userRepository: userRepositorySpy });

  return {
    sut,
    userRepositorySpy
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
      const params = { email: 'any_email' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('password'));
    });
  });

  describe('And the userRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new LoginUseCase();
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'getByEmail' of undefined"));
    });
  });
});
