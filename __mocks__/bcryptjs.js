module.exports = {
  isValid: true,

  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  }
};
