const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const logger = require("../utils/logger");

blogsRouter.get("/", (request, response) => {
  Blog.find({})
    .then(blogs => {
      return (response.json(blogs));
    });
});

blogsRouter.get("/:id", (request, response) => {
  Blog.findById(request.params.id)
    .then(foundBlog => {
      return (response.json(foundBlog));
    });
});

blogsRouter.delete("/:id", (request, response) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(deletedBlog => {
      return (response.status(200).json(deletedBlog));
    });
});

blogsRouter.post("/", (request, response, next) => {
  logger.info(request.json);
  const blog = new Blog(request.body);
  logger.info(blog);
  logger.info(request.body);

  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;
