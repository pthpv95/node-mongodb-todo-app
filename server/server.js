var express = require("express");
var bodyParser = require("body-parser");
var { ObjectId } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./model/todo");
const { User } = require("./model/user");
var _ = require("lodash");

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
      res.send(400);
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
    return res.send(404).send();
  } else {
    Todo.findById(id)
      .then(todo => {
        if (!todo) {
          res.send(404).send();
        } else {
          res.send({ todo });
        }
      })
      .catch(e => {
        res.send(404).send();
      });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.send(404).send();
  }
  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        res.send(404).send();
      } else {
        res.send({ todo });
      }
    })
    .catch(e => {
      res.send(404).send();
    });
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        res.send(404);
      }
      return res.send({ todo });
    })
    .catch(e => {
      return res.sendStatus(400).send(e);
    });
});

app.listen(port, () => {
  console.log("Starting on port" + port);
});

module.exports = {
  app
};
