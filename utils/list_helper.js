const lodash = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs.reduce((accumulator, blogPost) => accumulator + blogPost.likes, 0);

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return (null);
  }

  return (
    blogs.reduce(
      (mostLikedBlog, currentBlog) =>
        currentBlog.likes > mostLikedBlog.likes ? currentBlog : mostLikedBlog
    )
  );
};

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return (null);
  }

  // Group blogs by author
  const blogsByAuthor = lodash.groupBy(blogs, "author");

  // Find the author with the most blogs
  const authorWithMostBlogs = lodash.maxBy(
    lodash.keys(blogsByAuthor), (author) => blogsByAuthor[author].length
  );

  // Get the total number of blogs for the author with the most blogs
  const totalBlogsByAuthor = blogsByAuthor[authorWithMostBlogs].length;

  // Return the result as an object
  return { author: authorWithMostBlogs, blogs: totalBlogsByAuthor };
};

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  totalLikes
};
