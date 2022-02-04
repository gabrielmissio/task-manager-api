const BookDataFaker = require('./book-data-faker');
const ProfileDataFaker = require('./profile-data-faker');
const TaskDataFaker = require('./task-data-faker');

class UserDataFaker {
  static getUser() {
    const profile = ProfileDataFaker.getProfile();
    const book01 = BookDataFaker.getBook({ userId: profile.PK });
    const task01 = TaskDataFaker.getTask({ bookId: book01.SK, userId: profile.PK });

    return {
      profile,
      books: [book01],
      tasks: [task01]
    };
  }
}

module.exports = UserDataFaker;
