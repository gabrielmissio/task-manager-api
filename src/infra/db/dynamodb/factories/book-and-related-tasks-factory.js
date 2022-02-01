const BookFactory = require('./book-factory');
const TaskFactory = require('./task-factory');

class BooksAndRelatedTasksFactory {
  static buildBooksAndRelatedTasks(payload) {
    const isTask = (item) => item.SK.includes('#TASK#');
    const books = payload.filter((item) => !isTask(item));
    const tasks = payload.filter(isTask);

    const booksAndRelatedTasks = books.map((book) => Object.assign(BookFactory.buildBook(book), { tasks: [] }));

    tasks.forEach((task) => {
      const taskBookId = task.SK.split('#TASK#')[0].replace('BOOK#', '');
      const taskBook = booksAndRelatedTasks.find((book) => book.id === taskBookId);
      taskBook.tasks.push(TaskFactory.buildTask(task));
    });

    return booksAndRelatedTasks;
  }
}

module.exports = BooksAndRelatedTasksFactory;
