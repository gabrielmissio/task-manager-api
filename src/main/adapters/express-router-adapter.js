class ExpressRouterAdapter {
  static adapt(router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      const httpResponse = await router.route(httpRequest);
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
}

module.exports = ExpressRouterAdapter;
