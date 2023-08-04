require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const PORT = process.env.PORT || 3001;

const username = process.env.MONGODB_UN;
const clusterUrl = "cluster0.fyizezj.mongodb.net";

const password = process.env.MONGODB_PW;

const DATABASE_NAME =
  // testing with jest or testing e2e with cypress
  (
    process.env.NODE_ENV === "test"
      || process.env.NODE_ENV === "cypress"
  )
    ? process.env.TEST_DATABASE_NAME
    : process.env.DATABASE_NAME;

const MONGODB_URI = process.env.MONGODB_URL
  ? process.env.MONGODB_URL
  : `mongodb+srv://${username}:${password}` +
    `@${clusterUrl}/${DATABASE_NAME}?retryWrites=true&w=majority`;

const createMongoDbConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected to Mongodb: ${DATABASE_NAME}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB");
  }
};

module.exports = {
  MONGODB_URI, PORT, DATABASE_NAME, createMongoDbConnection
};
