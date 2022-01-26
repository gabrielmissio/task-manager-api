const { MissingParamError, InvalidParamError } = require('../errors');

class TokenDecoder {
  decode({ token } = {}) {
    if (!token) throw new MissingParamError('token');

    const splitedToken = token.split('.');
    const isValid = splitedToken.length === 3;
    if (!isValid) throw new InvalidParamError('token');

    const base64Payload = splitedToken[1].replace('-', '+').replace('_', '/');
    const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('binary'));

    return decodedPayload;
  }
}

module.exports = TokenDecoder;
