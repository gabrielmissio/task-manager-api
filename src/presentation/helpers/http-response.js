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
      body: { error: error.message }
    };
  }

  static unauthorized() {
    return {
      statusCode: 401,
      body: { error: new UnauthorizedError().message }
    };
  }

  static notFound(error) {
    return {
      statusCode: 404,
      body: { error: error.message }
    };
  }

  static internalServerError() {
    return {
      statusCode: 500,
      body: { error: new InternalServerError().message }
    };
  }

  static exceptionHandler(error) {
    return {
      statusCode: error.statusCode || 500,
      body: {
        error: error.description || new InternalServerError().message
      }
    };
  }
}

module.exports = HttpResponse;
