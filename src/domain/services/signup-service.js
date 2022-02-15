const { MissingParamError } = require('../../utils/errors');
const { ConflictError } = require('../errors');
const {
  ErrorMessagesEnum: { USER_ALREADY_EXISTS }
} = require('../../utils/enums');

class SignupService {
  constructor({ getProfileByEmailRepository, createProfileRepository } = {}) {
    this.getProfileByEmailRepository = getProfileByEmailRepository;
    this.createProfileRepository = createProfileRepository;
  }

  async handler({ name, email, password }) {
    if (!name) throw new MissingParamError('name');
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const userExists = await this.getProfileByEmailRepository.get({ email });
    if (userExists) throw new ConflictError(USER_ALREADY_EXISTS);

    const profile = await this.createProfileRepository.create({ name, email, password });
    return profile;
  }
}

module.exports = SignupService;
