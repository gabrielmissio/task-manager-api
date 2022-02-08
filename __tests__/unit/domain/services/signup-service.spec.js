const { MissingParamError } = require('../../../../src/utils/errors');

class SignupService {
  async handler() {
    throw new MissingParamError('name');
  }
}

const makeSut = () => {
  const sut = new SignupService();

  return { sut };
};

describe('Given the SignupService', () => {
  describe('And no name is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.handler({});

      await expect(promise).rejects.toThrow(new MissingParamError('name'));
    });
  });
});
