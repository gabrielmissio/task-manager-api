const { DynamodbClient } = require('../helpers');
const { BooksAndRelatedTasksFactory } = require('../factories');
const { MissingParamError } = require('../../../../utils/errors');
const { TASK_MANAGER_TABLE_NAME } = require('../../../../main/confing/env');

class GetBooksAndRelatedTasksByUserIdRepository {
  async get({ userId }) {
    const params = this.buildParams({ userId });
    const dynamodbResponse = await DynamodbClient.query(params);

    const booksAndTasksNotFound = dynamodbResponse.Count < 1;
    if (booksAndTasksNotFound) return null;

    const booksAndRelatedTasks = BooksAndRelatedTasksFactory.buildBooksAndRelatedTasks(dynamodbResponse.Items);
    return booksAndRelatedTasks;
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

module.exports = GetBooksAndRelatedTasksByUserIdRepository;
