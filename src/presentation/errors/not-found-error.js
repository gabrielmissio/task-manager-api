class NotFoundError extends Error {
  constructor(error) {
    super(`NotFoundError: ${error}`);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
