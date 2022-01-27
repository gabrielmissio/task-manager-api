const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class GetBooksAndRelatedTasksService {
  constructor({ getBooksAndRelatedTasksByUserIdRepository, bookAndRelatedTasksSerializer } = {}) {
    this.getBooksAndRelatedTasksByUserIdRepository = getBooksAndRelatedTasksByUserIdRepository;
    this.bookAndRelatedTasksSerializer = bookAndRelatedTasksSerializer;
  }

  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    this.getBooksAndRelatedTasksByUserIdRepository.get({ userId });
    this.bookAndRelatedTasksSerializer.serialize();
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

const makeBookAndRelatedTasksSerializerSpy = () => {
  class BookAndRelatedTasksSerializerSpy {
    serialize() {
      return this.response;
    }
  }

  return new BookAndRelatedTasksSerializerSpy();
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
      const params = { userId: 'any_email' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });

  describe('And the getBooksAndRelatedTasksByUserIdRepository dependency has no get method', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new GetBooksAndRelatedTasksService({ getBooksAndRelatedTasksByUserIdRepository: {} });
      const params = { userId: 'any_email' };

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

  describe('And the bookAndRelatedTasksSerializer dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const { getBooksAndRelatedTasksByUserIdRepositorySpy } = makeSut();
      const sut = new GetBooksAndRelatedTasksService({
        getBooksAndRelatedTasksByUserIdRepository: getBooksAndRelatedTasksByUserIdRepositorySpy
      });
      const params = { userId: 'any_email' };

      const response = sut.handler(params);

      await expect(response).rejects.toThrow(new Error("Cannot read property 'serialize' of undefined"));
    });
  });
});
