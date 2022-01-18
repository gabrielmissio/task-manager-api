const { MissingParamError } = require('../../utils/errors');

class LoginUseCase {
  constructor({ userRepository, encrypter, tokenGenerator, userFactory } = {}) {
    this.userRepository = userRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.userFactory = userFactory;
  }

  async handler({ email, password }) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.userRepository.getByEmail({ email });
    const isValid = user && (await this.encrypter.compare({ value: password, hash: user.password }));
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate({ value: user.id });
    const authenticationModel = this.userFactory.createAuthenticationModel({
      id: user.id,
      email: user.email,
      accessToken
    });

    return authenticationModel;
  }
}

module.exports = LoginUseCase;
