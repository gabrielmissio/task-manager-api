class InvalidParamError extends Error {
  constructor(error) {
    super(`InvalidParamError: ${error}`);
    this.name = 'InvalidParamError';
  }
}

module.exports = InvalidParamError;
