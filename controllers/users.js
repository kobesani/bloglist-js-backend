const bcrypt = require("bcrypt");

const User = require("../models/user");
const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username, name, passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
