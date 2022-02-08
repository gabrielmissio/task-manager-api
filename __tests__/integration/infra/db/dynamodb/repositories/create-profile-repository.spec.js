const { DynamodbClient } = require('../../../../../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../../../src/main/confing/env');
const { DataFakerHelper } = require('../../../../../helpers');
const { CreateProfileRepository } = require('../../../../../../src/infra/db/dynamodb/repositories');

const makeSut = () => {
  const sut = new CreateProfileRepository();

  return { sut };
};

describe('Given the CreateProfileRepository', () => {
  describe('And a valid payload is provided', () => {
    const payload = {
      name: DataFakerHelper.getString(),
      email: DataFakerHelper.getEmail(),
      password: DataFakerHelper.getPassword()
    };

    test('Then I expect it saves the new profile in the database', async () => {
      const { sut } = makeSut();
      const response = await sut.create(payload);

      const db = await DynamodbClient.query({
        TableName: TASK_MANAGER_TABLE_NAME,
        KeyConditionExpression: 'PK = :userId AND SK = :profile',
        ExpressionAttributeValues: { ':userId': `USER#${response.id}`, ':profile': 'PROFILE' }
      });

      expect(db.Items.length).toBeGreaterThan(0);
      expect(db.Items[0]).toEqual(
        expect.objectContaining({
          PK: expect.any(String),
          SK: 'PROFILE',
          createdAt: expect.any(String),
          email: payload.email,
          name: payload.name,
          password: expect.any(String)
        })
      );
    });
  });
});
