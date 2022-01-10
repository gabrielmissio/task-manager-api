class MissingParamError extends Error {
  constructor(paramName) {
    super(`MissingParamError: ${paramName}`);
    this.name = 'MissingParamError';
  }
}

module.exports = MissingParamError;
