const JWT = require('jsonwebtoken');

const { MissingParamError } = require('../errors');

class TokenGenerator {
  constructor({ secret } = {}) {
    this.secret = secret;
  }

  async generate({ value } = {}) {
    if (!this.secret) throw new MissingParamError('secret');
    if (!value) throw new MissingParamError('value');

    const token = JWT.sign({ id: value }, this.secret);
    return token;
  }
}

module.exports = TokenGenerator;
