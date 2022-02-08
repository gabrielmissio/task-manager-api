const { MissingParamError } = require('../../../../src/utils/errors');

class SignupService {
  async handler({ name, email, password }) {
    if (!name) throw new MissingParamError('name');
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    this.getProfileByEmailRepository.get();
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

  describe('And no password is provided', () => {
    test('Then I expect it throws a new MissingParamError', async () => {
      const { sut } = makeSut();
      const params = {
        name: 'any_name',
        email: 'any_email'
      };
      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new MissingParamError('password'));
    });
  });

  describe('And the getProfileByEmailRepository dependency is not injected', () => {
    test('Then I expect it throws an error', async () => {
      const sut = new SignupService();
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };

      const promise = sut.handler(params);

      await expect(promise).rejects.toThrow(new Error("Cannot read property 'get' of undefined"));
    });
  });
});
