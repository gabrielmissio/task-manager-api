const { DataFakerHelper } = require('../__tests__/helpers');

module.exports = {
  isValid: true,
  response: DataFakerHelper.getString(),

  async compare(value, hash) {
    this.params = { value, hash };
    return this.isValid;
  },

  async hash(value, saltRounds) {
    this.params = { value, saltRounds };
    return this.response;
  }
};
