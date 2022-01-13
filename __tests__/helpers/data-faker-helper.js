const Chance = require('chance');

const dataFaker = new Chance();

class DataFakerHelper {
  static getString({ length, pool, alpha, casing, symbols }) {
    return dataFaker.string({ length, pool, alpha, casing, symbols });
  }

  static getSentence({ words }) {
    return dataFaker.sentence({ words });
  }

  static getInteger({ min, max }) {
    return dataFaker.integer({ min, max });
  }
}

module.exports = DataFakerHelper;
