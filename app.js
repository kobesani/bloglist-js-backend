const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  // eslint-disable-next-line no-unused-vars
  .then(result => logger.info(`Connected to Mongodb: ${config.DATABASE_NAME}`))
  // eslint-disable-next-line no-unused-vars
  .catch(error => logger.error("Error connecting to MongoDB"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.morganConfig);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
