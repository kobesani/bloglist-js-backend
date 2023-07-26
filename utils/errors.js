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

class InvalidUserError extends Error {
  constructor(user) {
    if (!user) {
      super("No user found associated with JSON web token");
    } else {
      super(`User: ${user.username} was not found`);
    }
    this.name = "InvalidUserError";
  }
}

class InvalidTokenError extends Error {
  constructor(token) {
    super(
      `Decoded token with keys: [${Object.keys(token).join(", ")}] is invalid`
    );
    this.name = "InvalidTokenError";
  }
}

module.exports = {
  BlogNotFoundError,
  InvalidTokenError,
  InvalidUserError,
  PasswordTooShortError
};
