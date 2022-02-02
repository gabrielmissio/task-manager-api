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

  const sut = new LoginService({
    getProfileByEmailRepository: getProfileByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  });

  return {
    sut,
    getProfileByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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

  describe('And valid credentials are provided', () => {
    test('Then I expect it returns the AuthenticationModel with the expected params', async () => {
      const { sut, getProfileByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
      const params = {
        email: 'any_email',
        password: 'any_password'
      };

      const response = await sut.handler(params);

      await expect(response).toEqual({
        id: getProfileByEmailRepositorySpy.response.id,
        email: getProfileByEmailRepositorySpy.response.email,
        accessToken: tokenGeneratorSpy.response
      });
    });
  });
});
