class BookFactory {
  static buildBook(payload) {
    return {
      id: payload.SK.replace('BOOK#', ''),
      title: payload.title,
      description: payload.description,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt
    };
  }
}

module.exports = BookFactory;
