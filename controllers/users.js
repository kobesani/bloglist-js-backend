const bcrypt = require("bcrypt");

const User = require("../models/user");
const { PasswordTooShortError } = require("../utils/errors");
const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });

    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (password.length < 3) {
      throw new PasswordTooShortError(password);
    }

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
