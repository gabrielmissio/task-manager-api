const { MissingParamError } = require('../../src/utils/errors');

class PasswordGenerator {
  static generate(
    { numbers, upperCase, lowerCase, specials } = { numbers: 2, upperCase: 2, lowerCase: 3, specials: 1 }
  ) {
    const numbersPool = '0123456789';
    const upperCasePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCasePool = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharsPool = '.+-*/!@#$';
    const passwordLength = numbers + upperCase + lowerCase + specials;

    let password = '';
    password += this.characterShuffler({ pool: numbersPool, desiredNumberOfCharacters: numbers });
    password += this.characterShuffler({ pool: upperCasePool, desiredNumberOfCharacters: upperCase });
    password += this.characterShuffler({ pool: lowerCasePool, desiredNumberOfCharacters: lowerCase });
    password += this.characterShuffler({ pool: specialCharsPool, desiredNumberOfCharacters: specials });

    return this.characterShuffler({ pool: password, desiredNumberOfCharacters: passwordLength });
  }

  static characterShuffler({ pool, desiredNumberOfCharacters }) {
    if (!pool) throw new MissingParamError('pool');
    if (!desiredNumberOfCharacters) throw new MissingParamError('desiredNumberOfCharacters');

    const insufficientPool = pool.length < desiredNumberOfCharacters;
    const currentNumberOfCharacters = insufficientPool ? pool.length : desiredNumberOfCharacters;

    const response = pool
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
      .substr(0, currentNumberOfCharacters);

    return response;
  }
}

module.exports = PasswordGenerator;
