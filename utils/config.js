require("dotenv").config();

const PORT = process.env.PORT || 3001;

const username = process.env.MONGODB_UN;
const clusterUrl = "cluster0.fyizezj.mongodb.net";
const password = process.env.MONGODB_PW;

const DBNAME = "bloglistApp";

const MONGODB_URI = `mongodb+srv://${username}:${password}` +
  `@${clusterUrl}/${DBNAME}?retryWrites=true&w=majority`;

module.exports = {
  MONGODB_URI, PORT, DBNAME
};
