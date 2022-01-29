const { MissingParamError } = require('../../../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../../../helpers');

class GetBooksAndRelatedTasksByUserIdRepository {
  async get({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    return null;
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

  describe('And there is no user with the provided userId in the database', () => {
    test('Then I expect it returns null', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ userId: DataFakerHelper.getUUID() });

      expect(response).toBeNull();
    });
  });
});
