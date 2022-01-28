const { MissingParamError } = require('../../utils/errors');

class GetBooksAndRelatedTasksService {
  constructor({ getBooksAndRelatedTasksByUserIdRepository, booksAndRelatedTasksSerializer } = {}) {
    this.getBooksAndRelatedTasksByUserIdRepository = getBooksAndRelatedTasksByUserIdRepository;
    this.booksAndRelatedTasksSerializer = booksAndRelatedTasksSerializer;
  }

  async handler({ userId }) {
    if (!userId) throw new MissingParamError('userId');

    const booksAndRelatedTasks = await this.getBooksAndRelatedTasksByUserIdRepository.get({ userId });
    if (!booksAndRelatedTasks) return null;

    const booksAndRelatedTasksModel = this.booksAndRelatedTasksSerializer.serialize(booksAndRelatedTasks);
    return booksAndRelatedTasksModel;
  }
}

module.exports = GetBooksAndRelatedTasksService;
