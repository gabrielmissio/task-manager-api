const { InternalServerError } = require('../errors');

class HttpResponse {
  static ok(data) {
    return {
      statusCode: 200,
      body: data
    };
  }

  static badRequest(error) {
    return {
      statusCode: 400,
      body: error.message
    };
  }

  static exceptionHandler(error) {
    return {
      statusCode: error.statusCode || 500,
      body: error.description || new InternalServerError().message
    };
  }
}

module.exports = HttpResponse;
