const Chance = require('chance');

const PasswordGenerator = require('./password-generator');

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

  static getEmail({ domain } = {}) {
    return dataFaker.email({ domain });
  }

  static getPassword(
    { numbers, upperCase, lowerCase, specials } = { numbers: 2, upperCase: 2, lowerCase: 3, specials: 1 }
  ) {
    return PasswordGenerator.generate({ numbers, upperCase, lowerCase, specials });
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
