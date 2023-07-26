const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const invalidJwtToken = async () => {
  const nonExistingUser = new User({
    username: "blah",
    name: "blah",
    passwordHash: await bcrypt.hash("password123", 10)
  });

  const userForToken = {
    username: nonExistingUser.username,
    id: nonExistingUser._id.toString()
  };

  return (jwt.sign(userForToken, process.env.JWT_SECRET_SIGNATURE));
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
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 });
  return (blogs.map(blog => blog.toJSON()));
};

const usersInDb = async () => {
  const users = await User.find({});
  return (users.map(user => user.toJSON()));
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, createUser, invalidJwtToken
};
