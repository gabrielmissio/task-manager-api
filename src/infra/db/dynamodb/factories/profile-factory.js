class ProfileFactory {
  static buildProfile(payload) {
    return {
      id: payload.PK.replace('USER#', ''),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      createdAt: payload.createdAt
    };
  }
}

module.exports = ProfileFactory;
