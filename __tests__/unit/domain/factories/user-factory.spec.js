const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class UserFactory {
  createAuthenticationModel({ id, email, accessToken }) {
    if (!id) throw new MissingParamError('id');
    if (!email) throw new MissingParamError('email');
    if (!accessToken) throw new MissingParamError('accessToken');

    return {
      id,
      email,
      accessToken
    };
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

    describe('And valid parameters are provided', () => {
      test('Then I expect it returns an AuthenticationModel', () => {
        const { sut } = makeSut();
        const params = {
          id: DataFakerHelper.getInteger(),
          email: DataFakerHelper.getEmail(),
          accessToken: DataFakerHelper.getString()
        };
        const response = sut.createAuthenticationModel(params);

        expect(JSON.stringify(response)).toBe(
          JSON.stringify({
            id: params.id,
            email: params.email,
            accessToken: params.accessToken
          })
        );
      });
    });
  });
});
