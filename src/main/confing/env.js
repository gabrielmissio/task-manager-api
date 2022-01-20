module.exports = {
  REGION: process.env.REGION || 'localhost',
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  USER_TABLE_NAME: process.env.USER_TABLE_NAME || 'user'
};
