const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class GetBooksAndRelatedTasksService {
  constructor({ getBooksAndRelatedTasksByUserIdRepository, bookAndRelatedTasksSerializer } = {}) {
    this.getBooksAndRelatedTasksByUserIdRepository = getBooksAndRelatedTasksByUserIdRepository;
    this.bookAndRelatedTasksSerializer = bookAndRelatedTasksSerializer;
  }

  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');

    const booksAndRelatedTasks = await this.getBooksAndRelatedTasksByUserIdRepository.get({ userId });
    if (!booksAndRelatedTasks) return null;

    this.bookAndRelatedTasksSerializer.serialize(booksAndRelatedTasks);
    return 0;
  }
}

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

const makeBookAndRelatedTasksSerializerSpy = () => {
  class BookAndRelatedTasksSerializerSpy {
    serialize(params) {
      this.params = params;
      return this.response;
    }
  }

  return new BookAndRelatedTasksSerializerSpy();
};

const makeBookAndRelatedTasksSerializerSpyWithError = () => {
  class BookAndRelatedTasksSerializerSpyWithError {
    serialize() {
      throw new Error(this.error);
    }
  }

  return new BookAndRelatedTasksSerializerSpyWithError();
};

const makeSut = () => {
  const getBooksAndRelatedTasksByUserIdRepositorySpy = makeGetBooksAndRelatedTasksByUserIdRepositorySpy();
  getBooksAndRelatedTasksByUserIdRepositorySpy.response = DataFakerHelper.getObject();

  const bookAndRelatedTasksSerializerSpy = makeBookAndRelatedTasksSerializerSpy();
  bookAndRelatedTasksSerializerSpy.response = DataFakerHelper.getObject();

  const sut = new GetBooksAndRelatedTasksService({
    getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy,
    bookAndRelatedTasksSerializer: bookAndRelatedTasksSerializerSpy
  });

  return {
    sut,
    getBooksAndRelatedTasksByUserIdRepositorySpy,
    bookAndRelatedTasksSerializerSpy
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
    test('Then I expect it returns null', async () => {
      const { sut, getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      getBooksAndRelatedTasksByUserIdRepositorySpy.response = null;

      const params = { userId: 'any_userId' };
      const response = await sut.handler(params);

      expect(response).toBeNull();
    });
  });

  describe('And the bookAndRelatedTasksSerializer dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksService({
        getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy
      });
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error("Cannot read property 'serialize' of undefined"));
    });
  });

  describe('And the bookAndRelatedTasksSerializer dependency has no serialize method', () => {
    test('Then I expect it throws an error', async () => {
      const { getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksService({
        getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy,
        bookAndRelatedTasksSerializer: {}
      });
      const params = { userId: 'any_userId' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(
        new Error('this.bookAndRelatedTasksSerializer.serialize is not a function')
      );
    });
  });

  describe('And the serialize method of bookAndRelatedTasksSerializer dependency is called', () => {
    test('Then I expect it calls the serialize method with the value returned from get method of getBooksAndRelatedTasksByUserIdRepository dependency', async () => {
      const { sut, getBooksAndRelatedTasksByUserIdRepositorySpy, bookAndRelatedTasksSerializerSpy } = makeSut();
      const params = { userId: 'any_userId' };

      await sut.handler(params);

      expect(getBooksAndRelatedTasksByUserIdRepositorySpy.response).toEqual(bookAndRelatedTasksSerializerSpy.params);
    });
  });

  describe('And the serialize method of bookAndRelatedTasksSerializer dependency throws an error', () => {
    test('Then I expect it throws an error', async () => {
      const { getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      const bookAndRelatedTasksSerializerSpyWithError = makeBookAndRelatedTasksSerializerSpyWithError();
      bookAndRelatedTasksSerializerSpyWithError.error = DataFakerHelper.getSentence({ words: 3 });

      const sut = new GetBooksAndRelatedTasksService({
        getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy,
        bookAndRelatedTasksSerializer: bookAndRelatedTasksSerializerSpyWithError
      });

      const params = { userId: 'any_userId' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error(bookAndRelatedTasksSerializerSpyWithError.error));
    });
  });
});
