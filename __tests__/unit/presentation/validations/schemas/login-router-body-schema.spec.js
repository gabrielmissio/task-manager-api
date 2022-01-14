const Joi = require('joi');

const LoginRouterBodySchema = Joi.object({});

const makeSut = () => {
  const sut = LoginRouterBodySchema;

  return {
    sut
  };
};

describe('Given the LoginRouterBodySchema', () => {
  describe('And no parameters are provided', () => {
    test("Then I expect it returns an object with a 'value' key with undefined value", () => {
      const { sut } = makeSut();
      const response = sut.validate();

      expect(response.value).toBeUndefined();
    });
  });
});
