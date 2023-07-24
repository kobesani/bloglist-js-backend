const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const errors = require("../utils/errors");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
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

blogsRouter.post("/", async (request, response, next) => {
  try {
    logger.info(request.json);
    const blog = new Blog(request.body);
    logger.info(blog);
    logger.info(request.body);

    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
