const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const config = require("../utils/config");

const api = supertest(app);

beforeAll(config.createMongoDbConnection);

beforeEach(
  async () => {
    await Blog.deleteMany({});
    await User.deleteMany();

    const passwordHash = await bcrypt.hash("password123", 10);
    const user = new User({
      username: "root",
      name: "root",
      passwordHash
    });

    await user.save();
    const initialBlogs = helper.initialBlogs.map(
      blog => {
        return ({ ...blog, user: user.id });
      }
    );

    await Blog.insertMany(initialBlogs);
  }
);

describe("when there are blogs already saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const retrievedBlogs = await helper.blogsInDb();
    expect(retrievedBlogs).toHaveLength(helper.initialBlogs.length);
  });

  test("each returned blog has id property", async () => {
    const blogs = await helper.blogsInDb();
    const blogIds = blogs.map(blog => blog.id);
    blogIds.map(id => expect(id).toBeDefined());
  });

  test("a specific blog is returned with all blogs", async () => {
    const retrievedBlogs = await helper.blogsInDb();
    const titles = retrievedBlogs.map(blog => blog.title);
    expect(titles).toContain("First class tests");
  });
});

describe("when viewing a specific blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if does not exist", async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const usersAtStart = await helper.usersInDb();
    const testUser = usersAtStart[0];

    const userLogin = await api
      .post("/api/login")
      .send({
        username: testUser.username, password: "password123"
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    const addedBlog = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const addedBlogId = addedBlog.body.id;
    const retrievedBlogs = await helper.blogsInDb();

    expect(retrievedBlogs)
      .toHaveLength(helper.initialBlogs.length + 1);

    expect(retrievedBlogs.map(blog => blog.id))
      .toContain(addedBlogId);
  });

  test("when likes are missing in post, defaults to 0", async () => {
    const usersAtStart = await helper.usersInDb();
    const testUser = usersAtStart[0];

    const userLogin = await api
      .post("/api/login")
      .send({
        username: testUser.username, password: "password123"
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    };

    const returnedBlog = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const retrievedBlog = await api
      .get(`/api/blogs/${returnedBlog.body.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(retrievedBlog.body.id).toEqual(returnedBlog.body.id);
    expect(retrievedBlog.body.likes).toBe(0);
  });

  test("a blog with no title or url cannot be added", async () => {
    const usersAtStart = await helper.usersInDb();
    const testUser = usersAtStart[0];

    const userLogin = await api
      .post("/api/login")
      .send({
        username: testUser.username, password: "password123"
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsToBeTested = [
      {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      },
      {
        author: "Robert C. Martin",
        title: "Type wars",
      },
      {
        author: "Robert C. Martin",
      }
    ];

    const blogPromises = blogsToBeTested.map(
      async blog => api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${userLogin.body.token}`)
        .send(blog)
        .expect(400)
    );

    await Promise.all(blogPromises);
  });

  test("fails without valid jwt token - statuscode 401", async () => {
    const invalidJwtToken = jwt.sign({}, process.env.JWT_SECRET_SIGNATURE);

    await api
      .post("/api/blogs")
      .send({})
      .set("Authorization", `Bearer ${invalidJwtToken}`)
      .expect(401);
  });

  test("fails without valid user from token - statuscode 401", async () => {
    const invalidJwtToken = await helper.invalidJwtToken();

    expect(invalidJwtToken).toBeDefined();

    await api
      .post("/api/blogs")
      .send({})
      .set("Authorization", `Bearer ${invalidJwtToken}`)
      .expect(401);
  });
});

describe("deletion of a blog", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const deletedBlog = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd)
      .toHaveLength(helper.initialBlogs.length - 1);
    expect(blogsAtEnd.map(blog => blog.id))
      .not.toContain(deletedBlog.body.id);
  });
});

describe("updating a blog", () => {
  test("a blog can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    console.log(`Here is the updated blog id: ${blogToUpdate.id}`);

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBlogInDb = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes + 1);
    expect(updatedBlogInDb.body.likes).toBe(blogToUpdate.likes + 1);
  });

  test("fails with statuscode 404 if does not exist", async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send({ likes: 1 })
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
