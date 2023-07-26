const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const errors = require("./errors");
const logger = require("./logger");
const User = require("../models/user");

const requestBodyToken = morgan.token(
  // eslint-disable-next-line no-unused-vars
  "req-body", (request, response) => JSON.stringify(request.body)
);

const morganConfig = morgan(
  ":method :url :status :res[content-length] - :response-time ms :req-body"
);

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request["token"] = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    try {
      const decodedToken = jwt.verify(
        request.token, process.env.JWT_SECRET_SIGNATURE
      );

      if (!decodedToken.id) {
        throw new errors.InvalidTokenError(decodedToken);
      }

      const user = await User.findById(decodedToken.id);

      if (!user) {
        throw new errors.InvalidUserError(user);
      }

      request["user"] = user;
    } catch (error) {
      next(error);
    }
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return (
      response.status(400).send(
        { error: `400 - bad request - malformatted id = ${request.params.id}` }
      )
    );
  } else if (error.name === "ValidationError") {
    return (response.status(400).json({ error: error.message }));
  } else if (error.name === "BlogNotFoundError") {
    return (
      response.status(404).json(
        { error: `blog with id = ${error.blogId} not found!` }
      )
    );
  } else if (error.name === "JsonWebTokenError") {
    return (response.status(400).json({ error: error.message }));
  } else if (error.name === "PasswordTooShortError") {
    return (response.status(400).json({ error: error.message }));
  } else if (error.name === "InvalidUserError") {
    return (response.status(401).json({ error: error.message }));
  } else if (error.name === "InvalidTokenError") {
    return (response.status(401).json({ error: error.message }));
  } else if (error.name === "UnauthorizedForDeletionError") {
    return (response.status(401).json({ error: error.message }));
  }

  next(error);
};

module.exports = {
  errorHandler,
  morganConfig,
  requestBodyToken,
  tokenExtractor,
  unknownEndpoint,
  userExtractor
};
