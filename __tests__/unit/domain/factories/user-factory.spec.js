const { MissingParamError } = require('../../../../src/utils/errors');

class UserFactory {
  createAuthenticationModel({ id, email }) {
    if (!id) throw new MissingParamError('id');
    if (!email) throw new MissingParamError('email');
    throw new MissingParamError('accessToken');
  }
}

const makeSut = () => {
  const sut = new UserFactory();
  return { sut };
};

describe('Given the UserFactory', () => {
  describe('Given the createAuthenticationModel method', () => {
    describe('And no id is provided', () => {
      test('Then I expect it throws a MissingParamError', () => {
        const { sut } = makeSut();
        const response = () => sut.createAuthenticationModel({});

        expect(response).toThrow(new MissingParamError('id'));
      });
    });

    describe('And no email is provided', () => {
      test('Then I expect it throws a MissingParamError', () => {
        const { sut } = makeSut();
        const params = { id: 'any_id' };
        const response = () => sut.createAuthenticationModel(params);

        expect(response).toThrow(new MissingParamError('email'));
      });
    });

    describe('And no accessToken is provided', () => {
      test('Then I expect it throws a MissingParamError', () => {
        const { sut } = makeSut();
        const params = {
          id: 'any_id',
          email: 'any_email'
        };
        const response = () => sut.createAuthenticationModel(params);

        expect(response).toThrow(new MissingParamError('accessToken'));
      });
    });
  });
});
