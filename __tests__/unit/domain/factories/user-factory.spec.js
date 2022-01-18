const { MissingParamError } = require('../../../../src/utils/errors');

class UserFactory {
  createAuthenticationModel({ id }) {
    if (!id) throw new MissingParamError('id');
    throw new MissingParamError('email');
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
  });
});
