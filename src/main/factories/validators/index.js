const makeGetBooksAndRelatedTasksParamsValidator = require('./get-books-and-related-tasks-params-validator-factory');
const makeLoginControllerBodyValidator = require('./login-controller-body-validator-factory');

module.exports = {
  makeGetBooksAndRelatedTasksParamsValidator,
  makeLoginControllerBodyValidator
};
