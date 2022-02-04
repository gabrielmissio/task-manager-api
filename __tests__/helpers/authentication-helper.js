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
    const putData = async (item) =>
      DynamodbClient.put({
        TableName: TASK_MANAGER_TABLE_NAME,
        Item: item
      });

    await Promise.all([
      putData(this.user.profile),

      this.user.books.map((book) => putData(book)),
      this.user.tasks.map((task) => putData(task))
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
