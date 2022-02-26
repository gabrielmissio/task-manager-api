const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');
const { SignupService } = require('../../../../src/domain/services');

const makeCreateProfileRepositorySpy = () => {
  class CreateProfileRepositorySpy {
    async create(payload) {
      this.params = payload;

      return this.response;
    }
  }

  return new CreateProfileRepositorySpy();
};

const makeSut = () => {
  const createProfileRepositorySpy = makeCreateProfileRepositorySpy();
  createProfileRepositorySpy.response = DataFakerHelper.getObject();

  const sut = new SignupService({
    createProfileRepository: createProfileRepositorySpy
  });

  return {
    sut,
    createProfileRepositorySpy
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

  describe('And the createProfileRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy } = makeSut();
      const sut = new SignupService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy
      });

      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'create' of undefined"));
    });
  });

  describe('And the createProfileRepository dependency has no create method', () => {
    test('Then I expect it throws an error', async () => {
      const { getProfileByEmailRepositorySpy } = makeSut();
      const sut = new SignupService({
        getProfileByEmailRepository: getProfileByEmailRepositorySpy,
        createProfileRepository: {}
      });

      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error('this.createProfileRepository.create is not a function'));
    });
  });

  describe('And the createProfileRepository dependency is injected correctly', () => {
    let response;
    const { sut, createProfileRepositorySpy } = makeSut();
    const params = {
      name: DataFakerHelper.getString(),
      email: DataFakerHelper.getEmail(),
      password: DataFakerHelper.getPassword()
    };

    beforeAll(async () => {
      response = await sut.handler(params);
    });

    test('Then I expect it calls the create method with the expected params', async () => {
      expect(createProfileRepositorySpy.params).toEqual(params);
    });

    test('Then I expect it returns the return of the create method', async () => {
      expect(response).toEqual(createProfileRepositorySpy.response);
    });
  });
});
