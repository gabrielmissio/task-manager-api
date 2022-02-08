const { MissingParamError } = require('../../../../../../src/utils/errors');
const { DynamodbClient } = require('../../../../../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../../../src/main/confing/env');
const { DataFakerHelper, ProfileDataFaker } = require('../../../../../helpers');
const { ProfileFactory } = require('../../../../../../src/infra/db/dynamodb/factories');
const { GetProfileByUserIdRepository } = require('../../../../../../src/infra/db/dynamodb/repositories');

const makeSut = () => {
  const sut = new GetProfileByUserIdRepository();

  return { sut };
};

describe('Given the GetProfileByUserIdRepository', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.get({});

      await expect(promise).rejects.toThrow(new MissingParamError('userId'));
    });
  });

  describe('And there is no user with the provided userId', () => {
    test('Then I expect it returns null', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ userId: DataFakerHelper.getUUID() });

      expect(response).toBeNull();
    });
  });

  describe('And there is an user with the provided userId', () => {
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

    test('Then I expect it returns the user with the provided userId', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ userId: profileFake.PK.replace('USER#', '') });

      expect(response).toEqual(ProfileFactory.buildProfile(profileFake));
    });
  });
});
