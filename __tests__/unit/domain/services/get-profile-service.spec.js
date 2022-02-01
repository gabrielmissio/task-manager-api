const { GetProfileService } = require('../../../../src/domain/services');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

const makeGetProfileByUserIdRepositorySpy = () => {
  class GetProfileByUserIdRepositorySpy {
    async get({ userId }) {
      this.params = userId;
      return this.response;
    }
  }

  return new GetProfileByUserIdRepositorySpy();
};

const makeGetProfileByUserIdRepositorySpyWithError = () => {
  class GetProfileByUserIdRepositorySpyWithError {
    async get() {
      this.error = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.error);
    }
  }

  return new GetProfileByUserIdRepositorySpyWithError();
};

const makeSut = () => {
  const getProfileByUserIdRepositorySpy = makeGetProfileByUserIdRepositorySpy();
  getProfileByUserIdRepositorySpy.response = DataFakerHelper.getObject();

  const sut = new GetProfileService({
    getProfileByUserIdRepository: getProfileByUserIdRepositorySpy
  });

  return {
    sut,
    getProfileByUserIdRepositorySpy
  };
};

describe('Given the GetProfileService', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.handler({});

      await expect(promise).rejects.toThrow(new MissingParamError('userId'));
    });
  });

  describe('And the getProfileByUserIdRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new GetProfileService();
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });

  describe('And the getProfileByUserIdRepository dependency has no get method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new GetProfileService({ getProfileByUserIdRepository: {} });
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error('this.getProfileByUserIdRepository.get is not a function'));
    });
  });

  describe('And the get method of getProfileByUserIdRepository dependency is called', () => {
    test('Then I expect it calls the get method with the expected params', async () => {
      const { sut, getProfileByUserIdRepositorySpy } = makeSut();
      const params = { userId: DataFakerHelper.getUUID() };

      await sut.handler(params);

      expect(getProfileByUserIdRepositorySpy.params).toBe(params.userId);
    });
  });

  describe('And the get method of getProfileByUserIdRepository dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const getProfileByUserIdRepositorySpyWithError = makeGetProfileByUserIdRepositorySpyWithError();
      const sut = new GetProfileService({
        getProfileByUserIdRepository: getProfileByUserIdRepositorySpyWithError
      });

      const params = { userId: 'any_userId' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error(getProfileByUserIdRepositorySpyWithError.error));
    });
  });

  describe('And the get method of getProfileByUserIdRepository dependency returns null', () => {
    test('Then I expect it returns null', async () => {
      const { sut, getProfileByUserIdRepositorySpy } = makeSut();
      getProfileByUserIdRepositorySpy.response = null;

      const params = { userId: 'any_userId' };
      const response = await sut.handler(params);

      expect(response).toBeNull();
    });
  });

  describe('And the get method of getProfileByUserIdRepository dependency returns a profile', () => {
    test('Then I expect it returns the profile returned from the get method', async () => {
      const { sut, getProfileByUserIdRepositorySpy } = makeSut();

      const params = { userId: 'any_userId' };
      const response = await sut.handler(params);

      expect(response).toEqual(getProfileByUserIdRepositorySpy.response);
    });
  });
});
