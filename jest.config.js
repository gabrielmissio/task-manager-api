module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.js', '**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/infra/db/dynamodb/seeders/**',
    '!**/src/infra/db/dynamodb/migrations/**'
  ],
  testPathIgnorePatterns: ['/node_modules/']
};
