const JWT = require('jsonwebtoken');

const UserDataFaker = require('./user-data-faker');
const { DynamodbClient } = require('../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME, SECRET } = require('../../src/main/confing/env');

class AuthenticationHelper {
  constructor() {
    this.user = null;
    this.token = null;
  }

  async createNewUser({ hasBook = true, hasTask = true } = {}) {
    this.user = UserDataFaker.getUser();
    this.token = null;

    const putData = async (item) =>
      DynamodbClient.put({
        TableName: TASK_MANAGER_TABLE_NAME,
        Item: item
      });

    await Promise.all([
      putData(this.user.profile),

      hasBook && this.user.books.map((book) => putData(book)),
      hasTask && this.user.tasks.map((task) => putData(task))
    ]);

    return this.user;
  }

  async getUser() {
    if (!this.user) await this.createNewUser();

    return this.user;
  }

  async getAccessToken() {
    if (this.token) return this.token;
    if (!this.user) await this.createNewUser();

    this.token = JWT.sign({ userId: this.user.profile.PK.replace('USER#', '') }, SECRET);
    return this.token;
  }
}

module.exports = AuthenticationHelper;
