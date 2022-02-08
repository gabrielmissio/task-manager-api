const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class SignupService {
  constructor({ getProfileByEmailRepository } = {}) {
    this.getProfileByEmailRepository = getProfileByEmailRepository;
  }

  async handler({ name, email, password }) {
    if (!name) throw new MissingParamError('name');
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    await this.getProfileByEmailRepository.get();
  }
}

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
  const sut = new SignupService();

  return { sut };
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

  describe('And the getProfileByEmailRepository throws an error', () => {
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
});
