class InvalidRequestError extends Error {
  constructor(erros) {
    super(`InvalidRequestError: ${erros}`);
    this.name = 'InvalidRequestError';
  }
}

module.exports = InvalidRequestError;
