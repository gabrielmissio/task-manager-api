const { GetBooksAndRelatedTasksService } = require('../../../../src/domain/services');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

const makeGetBooksAndRelatedTasksByUserIdRepositorySpy = () => {
  class GetBooksAndRelatedTasksByUserIdRepositorySpy {
    async get({ userId }) {
      this.params = userId;
      return this.response;
    }
  }

  return new GetBooksAndRelatedTasksByUserIdRepositorySpy();
};

const makeGetBooksAndRelatedTasksByUserIdRepositorySpyWithError = () => {
  class GetBooksAndRelatedTasksByUserIdRepositorySpyWithError {
    async get() {
      this.error = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.error);
    }
  }

  return new GetBooksAndRelatedTasksByUserIdRepositorySpyWithError();
};

const makeSut = () => {
  const getBooksAndRelatedTasksByUserIdRepositorySpy = makeGetBooksAndRelatedTasksByUserIdRepositorySpy();
  getBooksAndRelatedTasksByUserIdRepositorySpy.response = DataFakerHelper.getObject();

  const sut = new GetBooksAndRelatedTasksService({
    getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy
  });

  return {
    sut,
    getBooksAndRelatedTasksByUserIdRepositorySpy
  };
};

describe('Given the GetBooksAndRelatedTasksService', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.handler({});

      await expect(promise).rejects.toThrow(new MissingParamError('userId'));
    });
  });

  describe('And the getBooksAndRelatedTasksByUserIdRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new GetBooksAndRelatedTasksService();
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });

  describe('And the getBooksAndRelatedTasksByUserIdRepository dependency has no get method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new GetBooksAndRelatedTasksService({ getBooksAndRelatedTasksByUserIdRepository: {} });
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(
        new Error('this.getBooksAndRelatedTasksByUserIdRepository.get is not a function')
      );
    });
  });

  describe('And the get method of getBooksAndRelatedTasksByUserIdRepository dependency is called', () => {
    test('Then I expect it calls the get method with the expected params', async () => {
      const { sut, getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      const params = { userId: DataFakerHelper.getUUID() };

      await sut.handler(params);

      expect(getBooksAndRelatedTasksByUserIdRepositorySpy.params).toBe(params.userId);
    });
  });

  describe('And the get method of getBooksAndRelatedTasksByUserIdRepository dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const getBooksAndRelatedTasksByUserIdRepositorySpyWithError =
        makeGetBooksAndRelatedTasksByUserIdRepositorySpyWithError();
      const sut = new GetBooksAndRelatedTasksService({
        getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpyWithError
      });

      const params = { userId: 'any_userId' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error(getBooksAndRelatedTasksByUserIdRepositorySpyWithError.error));
    });
  });

  describe('And the get method of getBooksAndRelatedTasksByUserIdRepository dependency returns null', () => {
    test('Then I expect it returns an empty array', async () => {
      const { sut, getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      getBooksAndRelatedTasksByUserIdRepositorySpy.response = null;

      const params = { userId: 'any_userId' };
      const response = await sut.handler(params);

      expect(response).toEqual([]);
    });
  });

  describe('And the get method of getBooksAndRelatedTasksByUserIdRepository dependency returns a booksAndRelatedTasksModel', () => {
    test('Then I expect it returns the bookAndRelatedTasksModel returned from the get method', async () => {
      const { sut, getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();

      const params = { userId: 'any_userId' };
      const response = await sut.handler(params);

      expect(response).toEqual(getBooksAndRelatedTasksByUserIdRepositorySpy.response);
    });
  });
});
