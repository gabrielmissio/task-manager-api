const { MissingParamError } = require('../../utils/errors');

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

module.exports = RequestValidator;
