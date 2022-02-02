const REGION = process.env.REGION || 'localhost';

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  REGION,
  SECRET: process.env.SECRET || 'secret',
  DYNAMODB_ENDPOINT: (REGION === 'localhost' && 'http://localhost:8000') || null,
  TASK_MANAGER_TABLE_NAME: process.env.TASK_MANAGER_TABLE_NAME || 'task-manager'
};
