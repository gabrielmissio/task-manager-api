const { MissingParamError } = require('../../../../src/utils/errors');

class GetBooksAndRelatedTasksService {
  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    this.getBooksAndRelatedTasksByUserIdRepository.get();
  }
}

const makeSut = () => {
  const sut = new GetBooksAndRelatedTasksService();

  return { sut };
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
});
