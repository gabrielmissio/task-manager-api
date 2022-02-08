const { DynamodbClient } = require('../helpers');
const { ProfileFactory } = require('../factories');
const { MissingParamError } = require('../../../../utils/errors');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../main/confing/env');

class GetProfileByEmailRepository {
  async get({ email }) {
    const params = this.buildParams({ email });
    const dynamodbResponse = await DynamodbClient.query(params);

    const userNotFound = dynamodbResponse.Count < 1;
    if (userNotFound) return null;

    const profile = ProfileFactory.buildProfile(dynamodbResponse.Items[0]);
    return profile;
  }

  buildParams({ email }) {
    if (!email) throw new MissingParamError('email');
    return {
      TableName: TASK_MANAGER_TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    };
  }
}

module.exports = GetProfileByEmailRepository;
