const mongoose = require("mongoose");

const logger = require("../utils/logger.js");

require("dotenv").config();

const username = process.env.MONGODB_UN;
const clusterUrl = "cluster0.fyizezj.mongodb.net";
const dbName = "bloglistApp";
const password = process.env.MONGODB_PW;

const uri = `mongodb+srv://${username}:${password}` +
  `@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose
  .connect(uri)
  // eslint-disable-next-line no-unused-vars
  .then(result => logger.info(`Connected to Mongodb: ${dbName}`))
  // eslint-disable-next-line no-unused-vars
  .catch(error => logger.error("Error connecting to MongoDB"));

const blogSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    url: String,
    likes: Number
  }
);

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Blog", blogSchema);
