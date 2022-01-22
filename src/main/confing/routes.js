const router = require('express').Router();
const { authRoutes } = require('../routes');

module.exports = (app) => {
  app.use('/', router);
  authRoutes(router);
};
