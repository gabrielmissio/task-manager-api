const makeCheckIfTokenUserIdIsEqualToProvidedService = require('./check-if-token-user-id-is-equal-to-provided-service-factory');
const makeGetBooksAndRelatedTasksService = require('./get-books-and-related-tasks-service-factory');
const makeGetProfileService = require('./get-profile-service-factory');
const makeLoginService = require('./login-service-factory');

module.exports = {
  makeCheckIfTokenUserIdIsEqualToProvidedService,
  makeGetBooksAndRelatedTasksService,
  makeGetProfileService,
  makeLoginService
};
