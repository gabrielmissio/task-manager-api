const { DynamodbClient } = require('../helpers');
const { UserProfileFactory } = require('../factories');
const { MissingParamError } = require('../../../../utils/errors');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../main/confing/env');

class GetUserProfileByEmailRepository {
  async get({ email }) {
    const params = this.buildParams({ email });
    const dynamodbResponse = await DynamodbClient.query(params);

    const userNotFound = dynamodbResponse.Count < 1;
    if (userNotFound) return null;

    const userProfile = UserProfileFactory.buildExistingUserProfile(dynamodbResponse.Items[0]);
    return userProfile;
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

module.exports = GetUserProfileByEmailRepository;
