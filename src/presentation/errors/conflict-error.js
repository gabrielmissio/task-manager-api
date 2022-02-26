class ConflictError extends Error {
  constructor(description) {
    super(`ConflictError: ${description}`);
    this.description = description;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
