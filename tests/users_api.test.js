const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const config = require("../utils/config");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeAll(config.createMongoDbConnection);

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 10);
    const user = new User({
      username: "root",
      name: "root",
      passwordHash
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "kobesani",
      name: "Kobe Rockata",
      password: "password456"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails when username already exists", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);

  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
