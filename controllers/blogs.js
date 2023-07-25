const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const errors = require("../utils/errors");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const foundBlog = await Blog.findById(request.params.id);
    if (!foundBlog) {
      throw new errors.BlogNotFoundError(request.params.id);
    }
    response.status(200).json(foundBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
    if (!deletedBlog) {
      throw new errors.BlogNotFoundError(request.params.id);
    }
    response.status(200).json(deletedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updatedBlog) {
      throw new errors.BlogNotFoundError(request.params.id);
    }
    response.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const user = await User.findById(request.body.user);
    const blog = new Blog({
      ...request.body,
      likes: request.body.likes || 0
    });

    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    user.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
