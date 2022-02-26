class GetCurrentDate {
  static get() {
    return new Date().toISOString();
  }
}

module.exports = GetCurrentDate;
