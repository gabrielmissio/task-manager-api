const AWS = require('aws-sdk');

const { REGION, DYNAMODB_ENDPOINT } = require('./env');

const DYNAMODB = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: DYNAMODB_ENDPOINT,
  region: REGION
});

module.exports = {
  DYNAMODB
};
