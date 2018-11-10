const { isProd } = require("../utils");
const { PRODUCTION_DATABASE_URI } = require("../../config");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const url = isProd
  ? PRODUCTION_DATABASE_URI
  : "mongodb://localhost:27017/TodoApp";

mongoose.connect(
  url,
  { useNewUrlParser: true }
);

module.exports = {
  mongoose
};
