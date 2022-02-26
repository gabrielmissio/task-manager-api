const { MissingParamError } = require('../../utils/errors');

class SignupService {
  constructor({ createProfileRepository } = {}) {
    this.createProfileRepository = createProfileRepository;
  }

  async handler({ name, email, password }) {
    if (!name) throw new MissingParamError('name');
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const profile = await this.createProfileRepository.create({ name, email, password });
    return profile;
  }
}

module.exports = SignupService;
