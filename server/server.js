var express = require("express");
var bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./model/todo");
const { User } = require("./model/user");

var app = express();
app.use(bodyParser.json());
var port = 3000;

app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    docs => {
      res.send(docs);
    },
    err => {
      console.log(err);
      res.status(400).send(err);
    }
  );
});

app.get("/", (req, res) => {
  // mongoose.get()
});
app.listen(port, () => {
  console.log("Starting on port 3000");
});
