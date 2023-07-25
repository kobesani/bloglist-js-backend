const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  }
];

const nonExistingId = async () => {
  const user = new User({
    username: "root",
    name: "root",
    passwordHash: await bcrypt.hash("password123", 10)
  });

  const blog = new Blog({
    title: "test blog name",
    author: "test author name",
    url: "test blog url",
    likes: 0,
    user: user._id
  });

  return (blog._id);
};

const createUser = async () => {
  await User.deleteMany({});
  const user = new User({
    username: "kobisan",
    name: "Kobi Rockata",
    passwordHash: await bcrypt.hash("password123", 10)
  });
  await user.save();
  return (user);
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return (blogs.map(blog => blog.toJSON()));
};

const usersInDb = async () => {
  const users = await User.find({});
  return (users.map(user => user.toJSON()));
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, createUser
};
