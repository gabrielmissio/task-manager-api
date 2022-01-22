const { LoginService } = require('../../../../src/domain/services');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

const makeGetProfileByEmailRepositorySpy = () => {
  class GetProfileByEmailRepositorySpy {
    async get({ email }) {
      this.email = email;
      if (this.response) this.response.email = email;

      return this.response;
    }
  }

  return new GetProfileByEmailRepositorySpy();
};

const makeGetProfileByEmailRepositorySpyWithError = () => {
  class GetProfileByEmailRepositorySpyWithError {
    async get() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new GetProfileByEmailRepositorySpyWithError();
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
    async get() {
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

const makeAuthenticationSerializerSpy = () => {
  class AuthenticationSerializerSpy {
    serialize({ id, email, accessToken }) {
      this.params = { id, email, accessToken };
      return this.response;
    }
  }

  return new AuthenticationSerializerSpy();
};

const makeAuthenticationSerializerSpyWithError = () => {
  class AuthenticationSerializerSpyWithError {
    serialize() {
      this.errorMessage = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.errorMessage);
    }
  }

  return new AuthenticationSerializerSpyWithError();
};

const makeSut = () => {
  const getProfileByEmailRepositorySpy = makeGetProfileByEmailRepositorySpy();
  getProfileByEmailRepositorySpy.response = {
    id: DataFakerHelper.getInteger(),
    password: DataFakerHelper.getString()
  };

  const encrypterSpy = makeEncrypterSpy();
  encrypterSpy.response = true;

  const tokenGeneratorSpy = makeTokenGeneratorSpy();
  tokenGeneratorSpy.response = DataFakerHelper.getString();

  const authenticationSerializerSpy = makeAuthenticationSerializerSpy();
  authenticationSerializerSpy.response = DataFakerHelper.getObject();

  const sut = new LoginService({
    getProfileByEmailRepository: getProfileByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    authenticationSerializer: authenticationSerializerSpy
  });

  return {
    sut,
    getProfileByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    authenticationSerializerSpy
  };
};

describe('Given the LoginService', () => {
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

  describe('And the getProfileByEmailRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new LoginService();
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });

  describe('And the getProfileByEmailRepository dependency does not have get method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new LoginService({ getProfileByEmailRepository: {} });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.getProfileByEmailRepository.get is not a function'));
    });
  });

  describe('And the getProfileByEmailRepository dependency is injected correctly', () => {
    test('Then I expect it calls the get method with the expected value', async () => {
      const { sut, getProfileByEmailRepositorySpy } = makeSut();
      const params = {
        email: DataFakerHelper.getEmail(),
        password: 'any_password'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(getProfileByEmailRepositorySpy.email).toBe(params.email);
    });
  });

  describe('And the getProfileByEmailRepository dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const getProfileByEmailRepositorySpyWithError = makeGetProfileByEmailRepositorySpyWithError();
      const sut = new LoginService({ getProfileByEmailRepository: getProfileByEmailRepositorySpyWithError });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(getProfileByEmailRepositorySpyWithError.errorMessage);
    });
  });

  describe('And the get method does not return any user', () => {
    test('Then I expect it returns null', async () => {
      const { sut, getProfileByEmailRepositorySpy } = makeSut();
      getProfileByEmailRepositorySpy.response = null;
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
      const { getProfileByEmailRepositorySpy } = makeSut();
      const sut = new LoginService({ getProfileByEmailRepository: getProfileByEmailRepositorySpy });
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
      const { getProfileByEmailRepositorySpy } = makeSut();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
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
      const { sut, encrypterSpy, getProfileByEmailRepositorySpy } = makeSut();
      const params = {
        email: 'any_email',
        password: DataFakerHelper.getPassword()
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(encrypterSpy.params.value).toBe(params.password);
      expect(encrypterSpy.params.hash).toBe(getProfileByEmailRepositorySpy.response.password);
    });
  });

  describe('And the encrypter dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy } = makeSut();
      const encrypterSpyWithError = makeEncrypterSpyWithError();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
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
      const { getProfileByEmailRepositorySpy, encrypterSpy } = makeSut();
      const sut = new LoginService({
        encrypter: encrypterSpy,
        getProfileByEmailRepository: getProfileByEmailRepositorySpy
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
      const { getProfileByEmailRepositorySpy, encrypterSpy } = makeSut();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
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
      const { sut, tokenGeneratorSpy, getProfileByEmailRepositorySpy } = makeSut();
      const params = {
        email: 'any_email',
        password: 'anyPassword'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(tokenGeneratorSpy.params).toBe(getProfileByEmailRepositorySpy.response.id);
    });
  });

  describe('And the tokenGenerator dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy, encrypterSpy } = makeSut();
      const tokenGeneratorSpyWithError = makeTokenGeneratorSpyWithError();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
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

  describe('And the authenticationSerializer dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const sut = new LoginService({
        encrypter: encrypterSpy,
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
        tokenGenerator: tokenGeneratorSpy
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'serialize' of undefined"));
    });
  });

  describe('And the authenticationSerializer dependency does not have serialize method', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy,
        authenticationSerializer: {}
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.authenticationSerializer.serialize is not a function'));
    });
  });

  describe('And the authenticationSerializer dependency is injected correctly', () => {
    test('Then I expect it calls the serialize method with the expected values', async () => {
      const { sut, authenticationSerializerSpy, tokenGeneratorSpy, getProfileByEmailRepositorySpy } = makeSut();
      const params = {
        email: DataFakerHelper.getEmail(),
        password: 'anyPassword'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(authenticationSerializerSpy.params.id).toBe(getProfileByEmailRepositorySpy.response.id);
      expect(authenticationSerializerSpy.params.email).toBe(getProfileByEmailRepositorySpy.response.email);
      expect(authenticationSerializerSpy.params.accessToken).toBe(tokenGeneratorSpy.response);
    });
  });

  describe('And the authenticationSerializer dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut();
      const authenticationSerializerSpyWithError = makeAuthenticationSerializerSpyWithError();
      const sut = new LoginService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy,
        authenticationSerializer: authenticationSerializerSpyWithError
      });
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(authenticationSerializerSpyWithError.errorMessage);
    });
  });

  describe('And valid credentials are provided', () => {
    test('Then I expect it returns the AuthenticationModel returned from the authenticationSerializer dependency', async () => {
      const { sut, authenticationSerializerSpy } = makeSut();
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const response = await sut.handler(params);

      await expect(response).toEqual(authenticationSerializerSpy.response);
    });
  });
});
