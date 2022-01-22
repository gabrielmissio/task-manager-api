const { MissingParamError } = require('../../../../src/utils/errors');

class Encrypter {
  async compare() {
    throw new MissingParamError('value');
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
});
