const router = require('express').Router();
const { authRoutes, bookRoutes } = require('../routes');

module.exports = (app) => {
  app.use('/', router);
  authRoutes(router);
  bookRoutes(router);
};
