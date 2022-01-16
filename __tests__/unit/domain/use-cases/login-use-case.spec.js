const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class LoginUseCase {
  constructor({ userRepository, encrypter } = {}) {
    this.userRepository = userRepository;
    this.encrypter = encrypter;
  }

  async handler({ email, password }) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.userRepository.getByEmail({ email });
    const isValid = user && (await this.encrypter.compare({ value: password, hash: user.password }));
    if (!isValid) return null;

    this.tokenGenerator.generate(user.id);
    return user;
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

const makeEncrypterSpy = () => {
  class EncrypterSpy {
    async compare({ value, hash }) {
      this.params = { value, hash };
      return this.response;
    }
  }

  return new EncrypterSpy();
};

const makeSut = () => {
  const userRepositorySpy = makeUserRepositorySpy();
  userRepositorySpy.response = true;

  const encrypterSpy = makeEncrypterSpy();
  encrypterSpy.response = true;

  const sut = new LoginUseCase({
    userRepository: userRepositorySpy,
    encrypter: encrypterSpy
  });

  return {
    sut,
    userRepositorySpy,
    encrypterSpy
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

  describe('And the userRepository dependency does not have getByEmail method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new LoginUseCase({ userRepository: {} });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.userRepository.getByEmail is not a function'));
    });
  });

  describe('And the userRepository dependency is injected correctly', () => {
    test('Then I expect it calls the getByEmail method with the expected value', async () => {
      const { sut, userRepositorySpy } = makeSut();
      const params = {
        email: DataFakerHelper.getEmail(),
        password: 'any_password'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(userRepositorySpy.email).toBe(params.email);
    });
  });

  describe('And the getByEmail method does not return any user', () => {
    test('Then I expect it returns null', async () => {
      const { sut, userRepositorySpy } = makeSut();
      userRepositorySpy.response = null;
      const params = {
        email: DataFakerHelper.getEmail(),
        password: 'any_password'
      };

      const response = await sut.handler(params);

      expect(response).toBeNull();
    });
  });

  describe('And the encrypter dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy } = makeSut();
      const sut = new LoginUseCase({ userRepository: userRepositorySpy });
      const params = {
        email: DataFakerHelper.getEmail(),
        password: DataFakerHelper.getPassword()
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'compare' of undefined"));
    });
  });

  describe('And the tokenGenerator dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy } = makeSut();
      const sut = new LoginUseCase({
        encrypter: encrypterSpy,
        userRepository: userRepositorySpy
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'generate' of undefined"));
    });
  });
});
