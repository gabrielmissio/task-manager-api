module.exports = {
  token: 'any_token',

  sign(value, secret) {
    this.value = value;
    this.secret = secret;

    return this.token;
  }
};
