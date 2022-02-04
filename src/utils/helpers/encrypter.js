const bcryptjs = require('bcryptjs');

const { MissingParamError } = require('../errors');

class Encrypter {
  async compare({ value, hash }) {
    if (!value) throw new MissingParamError('value');
    if (!hash) throw new MissingParamError('hash');

    const isValid = await bcryptjs.compare(value, hash);
    return isValid;
  }

  async hash({ value, saltRounds = 10 }) {
    if (!value) throw new MissingParamError('value');

    const hashedValue = await bcryptjs.hash(value, saltRounds);
    return hashedValue;
  }
}

module.exports = Encrypter;
