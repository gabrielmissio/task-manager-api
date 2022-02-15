const { MissingParamError } = require('../../../../src/utils/errors');
const {
  ErrorMessagesEnum: { USER_ALREADY_EXISTS }
} = require('../../../../src/utils/enums');
const { ConflictError } = require('../../../../src/domain/errors');
const { DataFakerHelper } = require('../../../helpers');

class SignupService {
  constructor({ getProfileByEmailRepository } = {}) {
    this.getProfileByEmailRepository = getProfileByEmailRepository;
  }

  async handler({ name, email, password }) {
    if (!name) throw new MissingParamError('name');
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const userExists = await this.getProfileByEmailRepository.get({ email });
    if (userExists) throw new ConflictError(USER_ALREADY_EXISTS);
  }
}

const makeGetProfileByEmailRepositorySpy = () => {
  class GetProfileByEmailRepositorySpy {
    async get({ email }) {
      this.email = email;

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

const makeSut = () => {
  const getProfileByEmailRepositorySpy = makeGetProfileByEmailRepositorySpy();
  getProfileByEmailRepositorySpy.response = DataFakerHelper.getObject();

  const sut = new SignupService({ getProfileByEmailRepository: getProfileByEmailRepositorySpy });

  return {
    sut,
    getProfileByEmailRepositorySpy
  };
};

describe('Given the SignupService', () => {
  describe('And no name is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.handler({});

      await expect(promise).rejects.toThrow(new MissingParamError('name'));
    });
  });

  describe('And no email is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const params = { name: 'any_name' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('email'));
    });
  });

  describe('And no password is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const params = {
        name: 'any_name',
        email: 'any_email'
      };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('password'));
    });
  });

  describe('And the getProfileByEmailRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new SignupService();
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });

  describe('And the getProfileByEmailRepository dependency has get method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new SignupService({ getProfileByEmailRepository: {} });
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.getProfileByEmailRepository.get is not a function'));
    });
  });

  describe('And the getProfileByEmailRepository dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const getProfileByEmailRepositorySpyWithError = makeGetProfileByEmailRepositorySpyWithError();
      const sut = new SignupService({ getProfileByEmailRepository: getProfileByEmailRepositorySpyWithError });
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(getProfileByEmailRepositorySpyWithError.errorMessage);
    });
  });

  describe('And the getProfileByEmailRepository dependency is injected correctly', () => {
    test('Then I expect it calls the get method with the expected params', async () => {
      const { sut, getProfileByEmailRepositorySpy } = makeSut();
      const params = {
        name: 'any_name',
        email: DataFakerHelper.getEmail(),
        password: 'any_password'
      };

      await Promise.allSettled([sut.handler(params)]);

      expect(getProfileByEmailRepositorySpy.email).toBe(params.email);
    });
  });

  describe('And the get method of getProfileByEmailRepository dependency returns a profile', () => {
    test('Then I expect it throws a new ConflictErrror with a message indicating that the user already exists', async () => {
      const { sut } = makeSut();
      const params = {
        name: 'any_name',
        email: DataFakerHelper.getEmail(),
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new ConflictError(USER_ALREADY_EXISTS));
    });
  });
});
