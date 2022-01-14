const Joi = require('joi');

const {
  Commons: { emailValidation, passwordValidation }
} = require('../../../../../src/presentation/validations/helpers');

const LoginRouterBodySchema = Joi.object({
  email: emailValidation.required(),
  password: passwordValidation.required()
});

const { DataFakerHelper } = require('../../../../helpers');

const makeSut = () => {
  const sut = LoginRouterBodySchema;

  return {
    sut
  };
};

describe('Given the LoginRouterBodySchema', () => {
  describe('And no parameters are provided', () => {
    test('Then I expect it returns an object with a "value" key with undefined value', () => {
      const { sut } = makeSut();
      const response = sut.validate();

      expect(response.value).toBeUndefined();
    });
  });

  describe('And no email is provided', () => {
    test('Then I expect it returns "email" is required in the error message', () => {
      const { sut } = makeSut();
      const response = sut.validate({});

      expect(response.error.message).toBe('"email" is required');
    });
  });

  describe('And an invalid email is provided', () => {
    test('Then I expect it returns "email" must be a valid email in the error message', () => {
      const { sut } = makeSut();
      const params = {
        email: DataFakerHelper.getString()
      };

      const response = sut.validate(params);

      expect(response.error.message).toBe('"email" must be a valid email');
    });
  });

  describe('And no password is provided', () => {
    test('Then I expect it returns "password" is required in the error message', () => {
      const { sut } = makeSut();
      const params = {
        email: DataFakerHelper.getEmail()
      };

      const response = sut.validate(params);

      expect(response.error.message).toBe('"password" is required');
    });
  });
});
