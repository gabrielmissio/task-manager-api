const CreateProfileRepository = require('./create-profile-repository');
const GetBooksAndRelatedTasksByUserIdRepository = require('./get-books-and-related-tasks-by-user-id-repository');
const GetProfileByEmailRepository = require('./get-profile-by-email-repository');
const GetProfileByUserIdRepository = require('./get-profile-by-user-id-repository');

module.exports = {
  CreateProfileRepository,
  GetBooksAndRelatedTasksByUserIdRepository,
  GetProfileByEmailRepository,
  GetProfileByUserIdRepository
};
