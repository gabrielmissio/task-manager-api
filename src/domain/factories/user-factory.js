const { MissingParamError } = require('../../utils/errors');

class UserFactory {
  createAuthenticationModel({ id, email, accessToken }) {
    if (!id) throw new MissingParamError('id');
    if (!email) throw new MissingParamError('email');
    if (!accessToken) throw new MissingParamError('accessToken');

    return {
      id,
      email,
      accessToken
    };
  }
}

module.exports = UserFactory;
