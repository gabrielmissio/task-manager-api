const DataFakerHelper = require('./data-faker-helper');
const { IdentifierGenerator } = require('../../src/infra/helpers');

class ProfileDataFaker {
  static getProfile() {
    return {
      PK: `USER#${IdentifierGenerator.newUUID()}`,
      SK: 'PROFILE',
      name: DataFakerHelper.getString(),
      email: DataFakerHelper.getEmail(),
      password: DataFakerHelper.getPassword(),
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = ProfileDataFaker;
