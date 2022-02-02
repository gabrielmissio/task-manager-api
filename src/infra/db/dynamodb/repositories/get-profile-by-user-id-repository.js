const { DynamodbClient } = require('../helpers');
const { ProfileFactory } = require('../factories');
const { MissingParamError } = require('../../../../utils/errors');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../main/confing/env');

class GetProfileByUserIdRepository {
  async get({ userId }) {
    const params = this.buildParams({ userId });
    const dynamodbResponse = await DynamodbClient.query(params);

    const userNotFound = dynamodbResponse.Count < 1;
    if (userNotFound) return null;

    const profile = ProfileFactory.buildExistingProfile(dynamodbResponse.Items[0]);
    return profile;
  }

  buildParams({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    return {
      TableName: TASK_MANAGER_TABLE_NAME,
      KeyConditionExpression: 'PK = :userId AND SK = :profile',
      ExpressionAttributeValues: { ':userId': `USER#${userId}`, ':profile': 'PROFILE' }
    };
  }
}

module.exports = GetProfileByUserIdRepository;
