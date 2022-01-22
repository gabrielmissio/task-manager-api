const { makeLoginController } = require('../factories/controllers');
const {
  ExpressRouterAdapter: { adapt }
} = require('../adapters');

module.exports = (router) => {
  router.post('/login', adapt(makeLoginController()));
};
