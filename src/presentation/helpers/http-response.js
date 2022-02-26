const { InternalServerError, UnauthorizedError, ForbiddenError } = require('../errors');

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

  static forbidden() {
    return {
      statusCode: 403,
      body: { error: new ForbiddenError().message }
    };
  }

  static notFound(error) {
    return {
      statusCode: 404,
      body: { error: error.message }
    };
  }

  static conflict(error) {
    return {
      statusCode: 409,
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
