const Chance = require('chance');

const dataFaker = new Chance();

class DataFakerHelper {
  static getString({ length, pool, alpha, casing, symbols } = {}) {
    return dataFaker.string({ length, pool, alpha, casing, symbols });
  }

  static getSentence({ words } = {}) {
    return dataFaker.sentence({ words });
  }

  static getInteger({ min, max } = {}) {
    return dataFaker.integer({ min, max });
  }

  static getObject({ length } = { length: 1 }) {
    const newObject = {};
    const pool = 'abcdefghijklmnopqrstuvwxyz';
    const getKeyOrValueSettings = { length: 4, pool };
    for (let index = 0; index < length; index += 1) {
      Object.assign(newObject, {
        [this.getString(getKeyOrValueSettings)]: this.getString(getKeyOrValueSettings)
      });
    }

    return newObject;
  }
}

module.exports = DataFakerHelper;
