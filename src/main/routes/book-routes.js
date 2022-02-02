const { makeGetBooksAndRelatedTasksController } = require('../factories/controllers');
const {
  ExpressRouterAdapter: { adapt }
} = require('../adapters');

module.exports = (router) => {
  router.get('/user/:userId/book', adapt(makeGetBooksAndRelatedTasksController()));
};
