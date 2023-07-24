const mongoose = require("mongoose");

const logger = require("../utils/logger");
const config = require("../utils/config");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  // eslint-disable-next-line no-unused-vars
  .then(result => logger.info(`Connected to Mongodb: ${config.DATABASE_NAME}`))
  // eslint-disable-next-line no-unused-vars
  .catch(error => logger.error("Error connecting to MongoDB"));

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    url: { type: String, required: true },
    likes: { type: Number, required: true }
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
