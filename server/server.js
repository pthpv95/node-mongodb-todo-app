var express = require("express");
var bodyParser = require("body-parser");
var { ObjectId } = require("mongodb");
const hbs = require("hbs");
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./model/todo");
const { User } = require("./model/user");

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
// app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("home.hbs", {
    author: "Hien Pham"
  });
});

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
      res.sendStatus(400);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(404).send();
  } else {
    Todo.findById(id)
      .then(todo => {
        if (!todo) {
          res.sendStatus(404).send();
        } else {
          res.send({ todo });
        }
      })
      .catch(e => {
        res.sendStatus(404).send();
      });
  }
});

app.listen(port, () => {
  console.log("Starting on port" + port);
});

module.exports = {
  app
};
