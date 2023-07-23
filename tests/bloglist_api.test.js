const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(
  async () => {
    await Blog.deleteMany({});
    let noteObject = new Blog(helper.initialBlogs[0]);
    await noteObject.save();
    noteObject = new Blog(helper.initialBlogs[1]);
    await noteObject.save();
  }
);

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

test("a specific blog is returned with all blogs", async () => {
  const retrievedBlogs = await helper.blogsInDb();
  const titles = retrievedBlogs.map(blog => blog.title);
  expect(titles).toContain("First class tests");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const retrievedBlogs = await helper.blogsInDb();
  const titles = retrievedBlogs.map(blog => blog.title);
  expect(retrievedBlogs).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain("Type wars");
});

test("a blog with no title cannot be added", async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);

  const retrievedBlogs = await helper.blogsInDb();
  expect(retrievedBlogs).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultBlog.body).toEqual(blogToView);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(async () => {
  await mongoose.connection.close();
});
