class BlogNotFoundError extends Error {
  constructor(blogId) {
    super(`blog with id = ${blogId} not found!`);
    this.name = "BlogNotFoundError";
    this.blogId = blogId;
  }
}

class PasswordTooShortError extends Error {
  constructor(password) {
    super(`Password length of ${password.length} is less than minimum of 3`);
    this.name = "PasswordTooShortError";
  }
}

module.exports = {
  BlogNotFoundError, PasswordTooShortError
};
