class BlogNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "BlogNotFoundError";
  }
}

module.exports = {
  BlogNotFoundError
};
