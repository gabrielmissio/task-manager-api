const { MissingParamError } = require('../../../../src/utils/errors');

class RequestValidator {
  constructor({ schema } = {}) {
    this.schema = schema;
  }

  validate(params) {
    if (!params) throw new MissingParamError('params');

    const { error } = this.schema.validate(params);
    return error;
  }
}

const makeSchemaSpy = () => {
  class SchemaSpy {
    validate() {
      return {};
    }
  }

  return new SchemaSpy();
};

const makeSut = () => {
  const schemaSpy = makeSchemaSpy();
  const sut = new RequestValidator({ schema: schemaSpy });
  return {
    sut
  };
};

describe('Given the RequestValidator', () => {
  describe('And no parameter was provided for validate method', () => {
    test('Then a expect it throws a MissingParamError error ', () => {
      const { sut } = makeSut();
      const response = () => sut.validate();

      expect(response).toThrow(new MissingParamError('params'));
    });
  });

  describe('And the schema dependency was not injected', () => {
    test('Then a expect it throws an error', () => {
      const sut = new RequestValidator();
      const response = () => sut.validate({ foo: 'baar' });

      expect(response).toThrow(new Error("Cannot read property 'validate' of undefined"));
    });
  });
});
