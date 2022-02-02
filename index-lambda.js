const serverless = require('serverless-http');

const app = require('./src/main/confing/app');

module.exports.handler = serverless(app);
