const config = require('./jest.config');

config.testMatch = ['**/__tests__/integration/**/*.spec.js'];
module.exports = config;
