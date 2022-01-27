const { MissingParamError } = require('../../../../src/utils/errors');

class GetBooksAndRelatedTasksService {
  async handler() {
    throw new MissingParamError('userId');
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
});
