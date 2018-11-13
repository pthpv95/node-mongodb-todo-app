require("./config");
var express = require("express");
var bodyParser = require("body-parser");
var { ObjectId } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./model/todo");
const { User } = require("./model/user");
var _ = require("lodash");
var { authenticate } = require("./middleware/authenticate");

var app = express();
var port = process.env.PORT;
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("home.hbs", {
    author: "Hien Pham"
  });
});

app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.send(404).send();
  } else {
    Todo.findOne({ _id: id, _creator: req.user._id })
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

app.delete("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndDelete({ _id: id, _creator: req.user._id })
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

app.patch("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectId.isValid(id)) {
    res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.send({ todo });
      }
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// POST /users
app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  var user = new User({
    email: body.email,
    password: body.password
  });

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      const pickedUserObject = user.toJSON();
      res.header("x-auth", token).send(pickedUserObject);
    })
    .catch(e => {
      res.send(400, e);
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(res => {
      res.send(200).send();
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.send(400).send();
    });
});

app.listen(port, () => {
  console.log("Starting on port" + port);
});

module.exports = {
  app
};
