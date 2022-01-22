const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class Encrypter {
  async compare({ value }) {
    if (!value) throw new MissingParamError('value');
    throw new MissingParamError('hash');
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
      const params = { value: DataFakerHelper.getPassword() };
      const promise = sut.compare(params);

      await expect(promise).rejects.toThrow(new MissingParamError('hash'));
    });
  });
});
