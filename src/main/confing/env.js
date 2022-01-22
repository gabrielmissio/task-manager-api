module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  REGION: process.env.REGION || 'localhost',
  SECRET: process.env.SECRET || 'secret',
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  TASK_MANAGER_TABLE_NAME: process.env.USER_TABLE_NAME || 'task-manager'
};
