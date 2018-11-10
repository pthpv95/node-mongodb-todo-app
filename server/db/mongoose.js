const { isProd } = require("../utils");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const url = isProd
  ? "todo-app-shard-00-00-obwkd.mongodb.net:27017"
  : "mongodb://localhost:27017/TodoApp";

mongoose.connect(
  url,
  { useNewUrlParser: true }
);

module.exports = {
  mongoose
};
