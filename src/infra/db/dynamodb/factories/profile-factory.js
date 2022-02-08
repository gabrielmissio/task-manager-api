const { IdentifierGenerator } = require('../../../helpers');
const { Encrypter } = require('../../../../utils/helpers');

const encrypter = new Encrypter();

class ProfileFactory {
  static buildProfile(payload) {
    return {
      id: payload.PK.replace('USER#', ''),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      createdAt: payload.createdAt
    };
  }

  static async buildNewProfile(payload) {
    const PK = `USER#${IdentifierGenerator.newUUID()}`;
    const hash = await encrypter.hash({ value: payload.password });
    const currentDate = new Date().toISOString();

    return {
      PK,
      SK: 'PROFILE',
      name: payload.name,
      email: payload.email,
      password: hash,
      createdAt: currentDate
    };
  }
}

module.exports = ProfileFactory;
