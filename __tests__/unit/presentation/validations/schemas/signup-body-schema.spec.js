const { SignupBodySchema } = require('../../../../../src/presentation/validations/schemas');
const { DataFakerHelper } = require('../../../../helpers');
const {
  ErrorMessagesEnum: { INVALID_PASSWORD, PASSWORD_RULES }
} = require('../../../../../src/utils/enums');

const makeSut = () => {
  const sut = SignupBodySchema;

  return {
    sut
  };
};

describe('Given the LoginBodySchema', () => {
  describe('And no parameters are provided', () => {
    test('Then I expect it returns an object with a "value" key with undefined value', () => {
      const { sut } = makeSut();
      const response = sut.validate();

      expect(response.value).toBeUndefined();
    });
  });

  describe('And an empty object is provided', () => {
    test('Then I expect it returns an object with a "error" property', () => {
      const { sut } = makeSut();
      const response = sut.validate({});

      expect(response.error).toBeTruthy();
    });
  });

  describe('And no name is provided', () => {
    test('Then I expect it returns "name" is required in the error message', () => {
      const { sut } = makeSut();
      const response = sut.validate({});

      expect(response.error.message).toBe('"name" is required');
    });
  });

  describe('And no email is provided', () => {
    test('Then I expect it returns "email" is required in the error message', () => {
      const { sut } = makeSut();
      const params = {
        name: DataFakerHelper.getString()
      };

      const response = sut.validate(params);

      expect(response.error.message).toBe('"email" is required');
    });
  });

  describe('And an invalid email is provided', () => {
    test('Then I expect it returns "email" must be a valid email in the error message', () => {
      const { sut } = makeSut();
      const params = {
        name: DataFakerHelper.getString(),
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
        name: DataFakerHelper.getString(),
        email: DataFakerHelper.getEmail()
      };

      const response = sut.validate(params);

      expect(response.error.message).toBe('"password" is required');
    });
  });

  describe('And an invalid password is provided', () => {
    test('Then I expect it returns INVALID_PASSWORD and PASSWORD_RULES in the error message', () => {
      const { sut } = makeSut();
      const params = {
        name: DataFakerHelper.getString(),
        email: DataFakerHelper.getEmail(),
        password: DataFakerHelper.getString({ length: 7 })
      };

      const response = sut.validate(params);

      expect(response.error.message).toBe(`${INVALID_PASSWORD}. ${PASSWORD_RULES}`);
    });
  });

  describe('And valid parameters are provided', () => {
    let response;
    const params = {
      name: DataFakerHelper.getString(),
      email: DataFakerHelper.getEmail(),
      password: DataFakerHelper.getPassword()
    };

    beforeAll(() => {
      const { sut } = makeSut();
      response = sut.validate(params);
    });

    test('Then I expect it returns the provided parameters in the "value" property', () => {
      expect(response.value).toEqual(params);
    });

    test('Then I expect it returns no "error" property', () => {
      expect(response.error).toBeFalsy();
    });
  });
});
