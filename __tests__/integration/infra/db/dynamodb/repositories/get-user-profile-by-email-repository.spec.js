const { MissingParamError } = require('../../../../../../src/utils/errors');
const { DynamodbClient } = require('../../../../../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../../../src/main/confing/env');
const { DataFakerHelper, ProfileDataFaker } = require('../../../../../helpers');

class GetUserProfileByEmailRepository {
  async get({ email }) {
    const params = this.buildParams({ email });
    const dynamodbResponse = await DynamodbClient.query(params);

    const userNotFound = dynamodbResponse.Count < 1;
    if (userNotFound) return null;

    const userProfile = this.buildUserProfile(dynamodbResponse.Items[0]);
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

  buildUserProfile(payload) {
    return {
      id: payload.PK.replace('USER#', ''),
      name: payload.name,
      email: payload.email,
      password: payload.password
    };
  }
}

const makeSut = () => {
  const sut = new GetUserProfileByEmailRepository();

  return { sut };
};

describe('Given the GetUserProfileByEmailRepository', () => {
  describe('And no email is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.get({});

      await expect(promise).rejects.toThrow(new MissingParamError('email'));
    });
  });

  describe('And there is no user with the provided email in the database', () => {
    test('Then I expect it returns null', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ email: DataFakerHelper.getEmail() });

      expect(response).toBeNull();
    });
  });

  describe('And there is already a user with the provided email in the database', () => {
    const profileFake = ProfileDataFaker.getProfile();

    beforeAll(async () => {
      await DynamodbClient.put({
        TableName: TASK_MANAGER_TABLE_NAME,
        Item: profileFake
      });
    });

    afterAll(async () => {
      await DynamodbClient.delete({
        TableName: TASK_MANAGER_TABLE_NAME,
        Key: {
          PK: profileFake.PK,
          SK: profileFake.SK
        }
      });
    });

    test('Then I expect it returns the user with the provided email', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ email: profileFake.email });

      expect(response).toEqual(sut.buildUserProfile(profileFake));
    });
  });
});
