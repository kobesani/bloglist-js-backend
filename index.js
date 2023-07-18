const express = require("express");
const app = express();
const cors = require("cors");

const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");

app.use("/api/blogs", blogsRouter);
app.use(cors());
app.use(express.json());

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
