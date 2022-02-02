const { MissingParamError } = require('../../utils/errors');

class CheckIfTokenUserIdIsEqualToProvidedService {
  constructor({ tokenDecoder } = {}) {
    this.tokenDecoder = tokenDecoder;
  }

  handler({ userId, token }) {
    if (!userId) throw new MissingParamError('userId');
    if (!token) throw new MissingParamError('token');

    const tokenPayload = this.tokenDecoder.decode({ token });
    const tokenUserId = tokenPayload && tokenPayload.userId;
    const isEqual = tokenUserId && tokenUserId === userId;

    return isEqual;
  }
}

module.exports = CheckIfTokenUserIdIsEqualToProvidedService;
