const router = require('express').Router();
const { Auth } = require('../middlewares');
const { authRoutes, bookRoutes } = require('../routes');

module.exports = (app) => {
  app.use('/', router);
  authRoutes(router);

  router.use(Auth);
  bookRoutes(router);
};
