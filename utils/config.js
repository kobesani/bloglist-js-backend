require("dotenv").config();

const PORT = process.env.PORT || 3001;

const username = process.env.MONGODB_UN;
const clusterUrl = "cluster0.fyizezj.mongodb.net";
const password = process.env.MONGODB_PW;

// const DBNAME = "bloglistApp";
const DATABASE_NAME = process.env.NODE_ENV === "test"
  ? process.env.TEST_DATABASE_NAME
  : process.env.DATABASE_NAME;


const MONGODB_URI = `mongodb+srv://${username}:${password}` +
  `@${clusterUrl}/${DATABASE_NAME}?retryWrites=true&w=majority`;

module.exports = {
  MONGODB_URI, PORT, DATABASE_NAME
};
