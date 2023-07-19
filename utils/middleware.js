const morgan = require("morgan");

const logger = require("./logger");

const requestBodyToken = morgan.token(
  // eslint-disable-next-line no-unused-vars
  "req-body", (request, response) => JSON.stringify(request.body)
);

const morganConfig = morgan(
  ":method :url :status :res[content-length] - :response-time ms :req-body"
);

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
  }
  next(error);
};

module.exports = {
  errorHandler,
  morganConfig,
  requestBodyToken,
  unknownEndpoint,
};
