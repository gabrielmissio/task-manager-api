class ConflictError extends Error {
  constructor(description) {
    super(`ConflictError: ${description}`);
    this.description = description;
    this.statusCode = 409;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
