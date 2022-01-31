class TaskFactory {
  static buildTask(payload) {
    return {
      id: payload.SK.split('#TASK#')[1],
      description: payload.description,
      isDone: payload.isDone,
      createdAt: payload.createdAt
    };
  }
}

module.exports = TaskFactory;
