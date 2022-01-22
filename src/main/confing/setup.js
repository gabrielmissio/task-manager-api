const { Cors, JsonParser } = require('../middlewares');

module.exports = (app) => {
  app.use(Cors);
  app.use(JsonParser);
};
