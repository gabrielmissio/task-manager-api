const { MissingParamError } = require('../../utils/errors');

class LoginService {
  constructor({ getProfileByEmailRepository, encrypter, tokenGenerator, authenticationSerializer } = {}) {
    this.getProfileByEmailRepository = getProfileByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.authenticationSerializer = authenticationSerializer;
  }

  async handler({ email, password }) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.getProfileByEmailRepository.get({ email });
    const isValid = user && (await this.encrypter.compare({ value: password, hash: user.password }));
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate({ value: user.id });
    const authenticationModel = this.authenticationSerializer.serialize({
      id: user.id,
      email: user.email,
      accessToken
    });

    return authenticationModel;
  }
}

module.exports = LoginService;
