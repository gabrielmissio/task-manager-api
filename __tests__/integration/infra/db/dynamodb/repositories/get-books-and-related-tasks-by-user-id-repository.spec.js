const { MissingParamError } = require('../../../../../../src/utils/errors');

class GetBooksAndRelatedTasksByUserIdRepository {
  async get() {
    throw new MissingParamError('userId');
  }
}

const makeSut = () => {
  const sut = new GetBooksAndRelatedTasksByUserIdRepository();

  return { sut };
};

describe('Given the GetBooksAndRelatedTasksByUserIdRepository', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.get({});

      await expect(promise).rejects.toThrow(new MissingParamError('userId'));
    });
  });
});
