const Joi = require('joi');

const {
  Commons: { emailValidation }
} = require('../../../../../src/presentation/validations/helpers');

const LoginRouterBodySchema = Joi.object({
  email: emailValidation.required()
});

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
});
