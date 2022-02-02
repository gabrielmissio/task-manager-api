const { MissingParamError } = require('../../utils/errors');

class GetBooksAndRelatedTasksService {
  constructor({ getBooksAndRelatedTasksByUserIdRepository } = {}) {
    this.getBooksAndRelatedTasksByUserIdRepository = getBooksAndRelatedTasksByUserIdRepository;
  }

  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');

    const booksAndRelatedTasks = await this.getBooksAndRelatedTasksByUserIdRepository.get({ userId });
    return booksAndRelatedTasks || [];
  }
}

module.exports = GetBooksAndRelatedTasksService;
