class BlogNotFoundError extends Error {
  constructor(blogId) {
    super(`blog with id = ${blogId} not found!`);
    this.name = "BlogNotFoundError";
    this.blogId = blogId;
  }
}

module.exports = {
  BlogNotFoundError
};
