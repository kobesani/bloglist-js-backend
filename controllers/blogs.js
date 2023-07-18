const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const logger = require("../utils/logger");

blogsRouter.get("/", (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

// blogsRouter.get("/:id", (request, response) => {
//   Blog
//     .findById(request.params.id)
//     .then(blogs => {
//       response.json(blogs);
//     });
// });

blogsRouter.post("/", (request, response) => {
  logger.info(request.json);
  const blog = new Blog(request.body);
  logger.info(blog);
  logger.info(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

module.exports = blogsRouter;
