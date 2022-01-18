const { MissingParamError } = require('../../../../src/utils/errors');

class UserFactory {
  createAuthenticationModel() {
    throw new MissingParamError('id');
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
  });
});
