const { MissingParamError } = require('../../../../../../src/utils/errors');

class UserRepository {
  async getByEmail() {
    throw new MissingParamError('email');
  }
}

const makeSut = () => {
  const sut = new UserRepository();

  return { sut };
};

describe('Given the UserRepository', () => {
  describe('Given the getByEmail method', () => {
    describe('And no email is provided', () => {
      test('Then I expect it throws a MissingParamError', async () => {
        const { sut } = makeSut();
        const promise = sut.getByEmail({});

        await expect(promise).rejects.toThrow(new MissingParamError('email'));
      });
    });
  });
});
