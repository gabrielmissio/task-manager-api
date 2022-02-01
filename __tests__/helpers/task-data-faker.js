const DataFakerHelper = require('./data-faker-helper');
const { IdentifierGenerator } = require('../../src/infra/helpers');

class TaskDataFaker {
  static getTask({ userId, bookId } = {}) {
    return {
      PK: `${userId || `USER#${IdentifierGenerator.newUUID()}`}`,
      SK: `${bookId || `BOOK#${IdentifierGenerator.newUUID()}`}#TASK#${IdentifierGenerator.newUUID()}`,
      description: DataFakerHelper.getSentence({ words: 5 }),
      isDone: false,
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = TaskDataFaker;
