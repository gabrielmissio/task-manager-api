const { LoginUseCase } = require('../../../../src/domain/use-cases');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

const makeUserRepositorySpy = () => {
  class UserRepositorySpy {
    async getByEmail({ email }) {
      this.email = email;
      if (this.response) this.response.email = email;

      return this.response;
    }
  }

  return new UserRepositorySpy();
};

const makeUserRepositorySpyWithError = () => {
  class UserRepositorySpyWithError {
    async getByEmail() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new UserRepositorySpyWithError();
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

const makeEncrypterSpyWithError = () => {
  class EncrypterSpyWithError {
    async getByEmail() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new EncrypterSpyWithError();
};

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate({ value }) {
      this.params = value;
      return this.response;
    }
  }

  return new TokenGeneratorSpy();
};

const makeTokenGeneratorSpyWithError = () => {
  class TokenGeneratorSpyWithError {
    async generate() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new TokenGeneratorSpyWithError();
};

const makeUserFactorySpy = () => {
  class UserFactorySpy {
    createAuthenticationModel({ id, email, accessToken }) {
      this.params = { id, email, accessToken };
      return this.response;
    }
  }

  return new UserFactorySpy();
};

const makeUserFactorySpyWithError = () => {
  class UserFactorySpyWithError {
    createAuthenticationModel() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new UserFactorySpyWithError();
};

const makeSut = () => {
  const userRepositorySpy = makeUserRepositorySpy();
  userRepositorySpy.response = {
    id: DataFakerHelper.getInteger(),
    password: DataFakerHelper.getString()
  };

  const encrypterSpy = makeEncrypterSpy();
  encrypterSpy.response = true;

  const tokenGeneratorSpy = makeTokenGeneratorSpy();
  tokenGeneratorSpy.response = DataFakerHelper.getString();

  const userFactorySpy = makeUserFactorySpy();
  userFactorySpy.response = DataFakerHelper.getObject();

  const sut = new LoginUseCase({
    userRepository: userRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    userFactory: userFactorySpy
  });

  return {
    sut,
    userRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    userFactorySpy
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

  describe('And the userRepository dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const userRepositorySpyWithError = makeUserRepositorySpyWithError();
      const sut = new LoginUseCase({ userRepository: userRepositorySpyWithError });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(userRepositorySpyWithError.errorMessage);
    });
  });

  describe('And the getByEmail method does not return any user', () => {
    test('Then I expect it returns null', async () => {
      const { sut, userRepositorySpy } = makeSut();
      userRepositorySpy.response = null;
      const params = {
        email: 'any_email',
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
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'compare' of undefined"));
    });
  });

  describe('And the encrypter dependency does not have compare method', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy } = makeSut();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: {}
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.encrypter.compare is not a function'));
    });
  });

  describe('And the encrypter dependency is injected correctly', () => {
    test('Then I expect it calls the compare method with the expected values', async () => {
      const { sut, encrypterSpy, userRepositorySpy } = makeSut();
      const params = {
        email: 'any_email',
        password: DataFakerHelper.getPassword()
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(encrypterSpy.params.value).toBe(params.password);
      expect(encrypterSpy.params.hash).toBe(userRepositorySpy.response.password);
    });
  });

  describe('And the encrypter dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy } = makeSut();
      const encrypterSpyWithError = makeEncrypterSpyWithError();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: encrypterSpyWithError
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(encrypterSpyWithError.errorMessage);
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

  describe('And the tokenGenerator dependency does not have generate method', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy } = makeSut();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: {}
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.tokenGenerator.generate is not a function'));
    });
  });

  describe('And the tokenGenerator dependency is injected correctly', () => {
    test('Then I expect it calls the generate method with the expected values', async () => {
      const { sut, tokenGeneratorSpy, userRepositorySpy } = makeSut();
      const params = {
        email: 'any_email',
        password: 'anyPassword'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(tokenGeneratorSpy.params).toBe(userRepositorySpy.response.id);
    });
  });

  describe('And the tokenGenerator dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy } = makeSut();
      const tokenGeneratorSpyWithError = makeTokenGeneratorSpyWithError();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpyWithError
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(tokenGeneratorSpyWithError.errorMessage);
    });
  });

  describe('And the userFactory dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const sut = new LoginUseCase({
        encrypter: encrypterSpy,
        userRepository: userRepositorySpy,
        tokenGenerator: tokenGeneratorSpy
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'createAuthenticationModel' of undefined"));
    });
  });

  describe('And the userFactory dependency does not have createAuthenticationModel method', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy,
        userFactory: {}
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.userFactory.createAuthenticationModel is not a function'));
    });
  });

  describe('And the userFactory dependency is injected correctly', () => {
    test('Then I expect it calls the createAuthenticationModel method with the expected values', async () => {
      const { sut, userFactorySpy, tokenGeneratorSpy, userRepositorySpy } = makeSut();
      const params = {
        email: DataFakerHelper.getEmail(),
        password: 'anyPassword'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(userFactorySpy.params.id).toBe(userRepositorySpy.response.id);
      expect(userFactorySpy.params.email).toBe(userRepositorySpy.response.email);
      expect(userFactorySpy.params.accessToken).toBe(tokenGeneratorSpy.response);
    });
  });

  describe('And the userFactory dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { userRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const userFactorySpyWithError = makeUserFactorySpyWithError();
      const sut = new LoginUseCase({
        userRepository: userRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy,
        userFactory: userFactorySpyWithError
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(userFactorySpyWithError.errorMessage);
    });
  });

  describe('And valid credentials are provided', () => {
    test('Then I expect it returns the AuthenticationModel returned from the userFactory dependency', async () => {
      const { sut, userFactorySpy } = makeSut();
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const response = await sut.handler(params);

      await expect(response).toEqual(userFactorySpy.response);
    });
  });
});
