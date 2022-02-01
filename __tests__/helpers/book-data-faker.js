const DataFakerHelper = require('./data-faker-helper');
const { IdentifierGenerator } = require('../../src/infra/helpers');

class BookDataFaker {
  static getBook({ userId } = {}) {
    return {
      PK: `${userId || `USER#${IdentifierGenerator.newUUID()}`}`,
      SK: `BOOK#${IdentifierGenerator.newUUID()}`,
      title: DataFakerHelper.getSentence({ words: 3 }),
      description: DataFakerHelper.getSentence({ words: 5 }),
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = BookDataFaker;
