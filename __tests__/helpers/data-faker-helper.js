const Chance = require('chance');

const dataFaker = new Chance();

class DataFakerHelper {
  static getString(config) {
    const { length, pool, alpha, casing, symbols } = config;
    return dataFaker.string({ length, pool, alpha, casing, symbols });
  }

  static getSentence(config) {
    const { words } = config;
    return dataFaker.sentence({ words });
  }
}

module.exports = DataFakerHelper;
