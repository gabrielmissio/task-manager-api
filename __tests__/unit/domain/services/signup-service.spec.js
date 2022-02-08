const { MissingParamError } = require('../../../../src/utils/errors');

class SignupService {
  async handler({ name }) {
    if (!name) throw new MissingParamError('name');
    throw new MissingParamError('email');
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

  describe('And no email is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const params = { name: 'any_name' };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('email'));
    });
  });
});
