const { DynamodbClient } = require('../helpers');
const { ProfileFactory } = require('../factories');
const { MissingParamError } = require('../../../../utils/errors');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../main/confing/env');

class CreateProfileRepository {
  async create(payload) {
    const profileToBeCreated = await ProfileFactory.buildNewProfile(payload);
    const params = this.buildParams({ profileToBeCreated });

    await DynamodbClient.put(params);

    const profile = ProfileFactory.buildProfile(profileToBeCreated);
    return profile;
  }

  buildParams({ profileToBeCreated }) {
    if (!profileToBeCreated) throw new MissingParamError('profileToBeCreated');
    return {
      TableName: TASK_MANAGER_TABLE_NAME,
      Item: profileToBeCreated
    };
  }
}

module.exports = CreateProfileRepository;
