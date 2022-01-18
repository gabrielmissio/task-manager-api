const { MissingParamError } = require('../../utils/errors');

class AuthenticationSerializer {
  serialize({ id, email, accessToken }) {
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

module.exports = AuthenticationSerializer;
