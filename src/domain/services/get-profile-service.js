const { MissingParamError } = require('../../utils/errors');

class GetProfileService {
  constructor({ getProfileByUserIdRepository } = {}) {
    this.getProfileByUserIdRepository = getProfileByUserIdRepository;
  }

  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');

    const profile = await this.getProfileByUserIdRepository.get({ userId });
    return profile || null; // TODO: should remove password property (ensure)
  }
}

module.exports = GetProfileService;
