const bcryptjs = require('bcryptjs');

const { MissingParamError } = require('../../../../src/utils/errors');

class Encrypter {
  async compare({ value, hash }) {
    if (!value) throw new MissingParamError('value');
    if (!hash) throw new MissingParamError('hash');

    const isValid = await bcryptjs.compare(value, hash);
    return isValid;
  }
}

const makeSut = () => {
  const sut = new Encrypter();

  return { sut };
};

describe('Given the Encrypter', () => {
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
});
