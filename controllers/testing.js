const testingRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

testingRouter.post("/reset", async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  response.status(204).end();
});

testingRouter.post("/reset-blogs-only", async (request, response) => {
  await Blog.deleteMany({});
  response.status(204).end();
});

testingRouter.post("/reset-users-only", async (request, response) => {
  await User.deleteMany({});
  response.status(204).end();
});

module.exports = testingRouter;
