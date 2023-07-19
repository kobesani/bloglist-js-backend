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

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes
};
