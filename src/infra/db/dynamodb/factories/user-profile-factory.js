class UserProfileFactory {
  static buildExistingUserProfile(payload) {
    return {
      id: payload.PK.replace('USER#', ''),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      createdAt: payload.createdAt
    };
  }
}

module.exports = UserProfileFactory;
