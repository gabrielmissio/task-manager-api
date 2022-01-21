const { randomUUID } = require('crypto');

class IdentifierGenerator {
  static newUUID() {
    return randomUUID();
  }
}

module.exports = IdentifierGenerator;
