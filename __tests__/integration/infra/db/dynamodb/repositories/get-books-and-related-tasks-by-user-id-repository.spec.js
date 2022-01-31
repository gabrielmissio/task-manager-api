const { MissingParamError } = require('../../../../../../src/utils/errors');
const { DynamodbClient } = require('../../../../../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../../../src/main/confing/env');
const { DataFakerHelper, BookDataFaker, TaskDataFaker } = require('../../../../../helpers');

class GetBooksAndRelatedTasksByUserIdRepository {
  async get({ userId }) {
    const params = this.buildParams({ userId });
    const dynamodbResponse = await DynamodbClient.query(params);

    const userNotFound = dynamodbResponse.Count < 1;
    if (userNotFound) return null;

    return dynamodbResponse;
  }

  buildParams({ userId }) {
    if (!userId) throw new MissingParamError('userId');
    return {
      TableName: TASK_MANAGER_TABLE_NAME,
      KeyConditionExpression: 'PK = :userId AND begins_with(SK, :book)',
      ExpressionAttributeValues: { ':userId': `USER#${userId}`, ':book': 'BOOK#' }
    };
  }
}

const makeSut = () => {
  const sut = new GetBooksAndRelatedTasksByUserIdRepository();

  return { sut };
};

describe('Given the GetBooksAndRelatedTasksByUserIdRepository', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a MissingParamError', async () => {
      const { sut } = makeSut();
      const promise = sut.get({});

      await expect(promise).rejects.toThrow(new MissingParamError('userId'));
    });
  });

  describe('And there is no user with the provided userId in the database', () => {
    test('Then I expect it returns null', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ userId: DataFakerHelper.getUUID() });

      expect(response).toBeNull();
    });
  });

  describe('And there is an user with the provided userId in the database', () => {
    const bookFake = BookDataFaker.getBook();
    const taskFake01 = TaskDataFaker.getTask({ userId: bookFake.PK, bookId: bookFake.SK });
    const taskFake02 = TaskDataFaker.getTask({ userId: bookFake.PK, bookId: bookFake.SK });

    beforeAll(async () => {
      await Promise.all([
        DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: bookFake
        }),

        DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: taskFake01
        }),

        DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: taskFake02
        })
      ]);
    });

    afterAll(async () => {
      await Promise.all([
        DynamodbClient.delete({
          TableName: TASK_MANAGER_TABLE_NAME,
          Key: {
            PK: bookFake.PK,
            SK: bookFake.SK
          }
        }),

        DynamodbClient.delete({
          TableName: TASK_MANAGER_TABLE_NAME,
          Key: {
            PK: taskFake01.PK,
            SK: taskFake01.SK
          }
        }),

        DynamodbClient.delete({
          TableName: TASK_MANAGER_TABLE_NAME,
          Key: {
            PK: taskFake02.PK,
            SK: taskFake02.SK
          }
        })
      ]);
    });

    test('Then I expect it returns the user with the provided email', async () => {
      const { sut } = makeSut();
      const response = await sut.get({ userId: bookFake.PK.replace('USER#', '') });

      expect(response).toEqual({});
    });
  });
});
