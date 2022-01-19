const AWS = require('aws-sdk');

const REGION = process.env.REGION || 'localhost';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';

const CLIENT = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: DYNAMODB_ENDPOINT,
  region: REGION
});

class DynamodbClient {
  static async get(params) {
    const response = await CLIENT.get(params).promise();

    const error = this.getResponseError(response);
    if (error) throw new Error(error);

    return response;
  }

  static async query(params) {
    const response = await CLIENT.query(params).promise();

    const error = this.getResponseError(response);
    if (error) throw new Error(error);

    return response;
  }

  static getResponseError({ $response }) {
    return $response && $response.error;
  }
}

module.exports = DynamodbClient;
