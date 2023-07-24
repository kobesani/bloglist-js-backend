const listHelper = require("../utils/list_helper");
const listHelperData = require("./data/list_helper.data");

describe("total likes", () => {
  test("of empty list is zero", () => {
    expect(listHelper.totalLikes(listHelperData.listWithNoBlogs)).toBe(0);
  });

  test("of a list with a single blog equals the likes of that one", () => {
    expect(listHelper.totalLikes(listHelperData.listWithOneBlog)).toBe(5);
  });

  test("of a list with several blogs, equal the likes of the sum", () => {
    expect(listHelper.totalLikes(listHelperData.listWithSeveralBlogs)).toBe(36);
  });
});

describe("favorite blog", () => {
  test("of an empty list is null", () => {
    expect(listHelper.favoriteBlog(listHelperData.listWithNoBlogs)).toBe(null);
  });

  test("of a list with a single blog is that one", () => {
    expect(listHelper.favoriteBlog(listHelperData.listWithOneBlog)).toEqual(
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      }
    );
  });

  test("of a large list of blogs is the one with the most likes", () => {
    expect(listHelper.favoriteBlog(listHelperData.listWithSeveralBlogs)).toEqual(
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      },
    );
  });
});

describe("most blogs", () => {
  test("of an empty list is null", () => {
    expect(listHelper.mostBlogs(listHelperData.listWithNoBlogs)).toBe(null);
  });

  test("of a list with a single blog is that one author with 1 blog", () => {
    expect(listHelper.mostBlogs(listHelperData.listWithOneBlog)).toEqual(
      {
        author: "Edsger W. Dijkstra", blogs: 1
      }
    );
  });

  test("of a list with several blogs is the author with the most blogs", () => {
    expect(listHelper.mostBlogs(listHelperData.listWithSeveralBlogs)).toEqual(
      {
        author: "Robert C. Martin", blogs: 3
      }
    );
  });

  test("of a list with two blogs, two different authors, returns result", () => {
    expect(listHelper.mostBlogs(listHelperData.listWithTwoBlogsTwoAuthors)).toEqual(
      { author: "Edsger W. Dijkstra", blogs: 1 }
    );
  });
});

describe("most likes", () => {
  test("of an empty list is null", () => {
    expect(listHelper.mostLikes(listHelperData.listWithNoBlogs)).toBe(null);
  });

  test("of a list with a single blog is that one author with 1 blog", () => {
    expect(listHelper.mostLikes(listHelperData.listWithOneBlog)).toEqual(
      {
        author: "Edsger W. Dijkstra", totalLikes: 5
      }
    );
  });

  test("of a list with several blogs is the author with the most likes", () => {
    expect(listHelper.mostLikes(listHelperData.listWithSeveralBlogs)).toEqual(
      {
        author: "Edsger W. Dijkstra", totalLikes: 17
      }
    );
  });

  test("of a list where authors tie for most likes, returns one of them", () => {
    expect(listHelper.mostLikes(listHelperData.listWithBlogsAuthorsSameLikes)).toEqual(
      { author: "Edsger W. Dijkstra", totalLikes: 12 }
    );
  });
});
