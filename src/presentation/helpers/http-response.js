const { InternalServerError, UnauthorizedError } = require('../errors');

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

  static unauthorized() {
    return {
      statusCode: 401,
      body: new UnauthorizedError().message
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
