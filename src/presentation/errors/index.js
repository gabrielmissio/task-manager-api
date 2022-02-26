const ConflictError = require('./conflict-error');
const ForbiddenError = require('./forbidden-error');
const InvalidRequestError = require('./invalid-request-error');
const InternalServerError = require('./internal-server-error');
const NotFoundError = require('./not-found-error');
const UnauthorizedError = require('./unauthorized-error');

module.exports = {
  ConflictError,
  ForbiddenError,
  InvalidRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
};
