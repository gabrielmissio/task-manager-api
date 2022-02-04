const bcryptjs = require('bcryptjs');

const { Encrypter } = require('../../../../src/utils/helpers');
const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

const makeSut = () => {
  const sut = new Encrypter();

  return { sut };
};

describe('Given the Encrypter', () => {
  describe('Given the compare method', () => {
    describe('And no value is provided', () => {
      test('Then I expect it throws a new MissingParamError', async () => {
        const { sut } = makeSut();
        const promise = sut.compare({});

        await expect(promise).rejects.toThrow(new MissingParamError('value'));
      });
    });

    describe('And no hash is provided', () => {
      test('Then I expect it throws a new MissingParamError', async () => {
        const { sut } = makeSut();
        const params = { value: 'any_value' };
        const promise = sut.compare(params);

        await expect(promise).rejects.toThrow(new MissingParamError('hash'));
      });
    });

    describe('And bcryptjs returns true', () => {
      test('Then I expect it returns true', async () => {
        const { sut } = makeSut();
        const params = { value: 'any_value', hash: 'any_hash' };
        const isValid = await sut.compare(params);

        expect(isValid).toBe(true);
      });
    });

    describe('And bcryptjs returns false', () => {
      test('Then I expect it returns false', async () => {
        const { sut } = makeSut();
        bcryptjs.isValid = false;
        const params = { value: 'any_value', hash: 'any_hash' };
        const isValid = await sut.compare(params);

        expect(isValid).toBe(false);
      });
    });

    describe('And calls compare method of bcryptjs', () => {
      test('Then I expect it calls compare method with the expected params', async () => {
        const { sut } = makeSut();
        const params = {
          value: DataFakerHelper.getString(),
          hash: DataFakerHelper.getString()
        };
        await sut.compare(params);

        expect(bcryptjs.params.value).toBe(params.value);
        expect(bcryptjs.params.hash).toBe(params.hash);
      });
    });
  });

  describe('Given the hash method', () => {
    describe('And no value is provided', () => {
      test('Then I expect it throws a new MissingParamError', async () => {
        const { sut } = makeSut();
        const promise = sut.hash({});

        await expect(promise).rejects.toThrow(new MissingParamError('value'));
      });
    });

    describe('And calls hash method of bcryptjs', () => {
      let response;
      const params = {
        value: DataFakerHelper.getString(),
        saltRounds: DataFakerHelper.getInteger({ min: 5, max: 15 })
      };
      beforeAll(async () => {
        const { sut } = makeSut();
        response = await sut.hash(params);
      });

      test('Then I expect it calls hash method with the expected params', async () => {
        expect(bcryptjs.params.value).toBe(params.value);
        expect(bcryptjs.params.saltRounds).toBe(params.saltRounds);
      });

      test('Then I expect it returns the value returned by the hash method', async () => {
        expect(response).toBe(bcryptjs.response);
      });
    });

    describe('And no saltRounds is provided', () => {
      const DEFAULT_SALT_ROUNDS = 10;

      test(`Then I expect it sets saltRounds as ${DEFAULT_SALT_ROUNDS} by default`, async () => {
        const { sut } = makeSut();
        const params = {
          value: DataFakerHelper.getString()
        };
        await sut.hash(params);

        expect(bcryptjs.params.value).toBe(params.value);
        expect(bcryptjs.params.saltRounds).toBe(DEFAULT_SALT_ROUNDS);
      });
    });
  });
});
