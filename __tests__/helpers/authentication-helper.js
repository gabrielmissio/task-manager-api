const JWT = require('jsonwebtoken');

const UserDataFaker = require('./user-data-faker');
const { DynamodbClient } = require('../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME, SECRET } = require('../../src/main/confing/env');

class AuthenticationHelper {
  constructor() {
    this.user = null;
  }

  async createNewUser() {
    this.user = UserDataFaker.getUser();

    await Promise.all([
      DynamodbClient.put({
        TableName: TASK_MANAGER_TABLE_NAME,
        Item: this.user.profile
      }),

      this.user.books.map((book) =>
        DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: book
        })
      ),
      this.user.tasks.map((task) =>
        DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: task
        })
      )
    ]);

    return this.user;
  }

  async getUser() {
    if (!this.user) await this.createNewUser();

    return this.user;
  }

  async getAccessTokem() {
    if (!this.user) await this.createNewUser();

    const token = JWT.sign({ userId: this.user.profile.PK.replace('USER#', '') }, SECRET);
    return token;
  }
}

module.exports = AuthenticationHelper;
