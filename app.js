const express = require("express");
const cors = require("cors");
const config = require("./utils/config");

const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");


if (process.env.NODE_ENV !== "test") {
  config.createMongoDbConnection();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.morganConfig);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (
  process.env.NODE_ENV === "test"
    || process.env.NODE_ENV === "cypress"
) {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
