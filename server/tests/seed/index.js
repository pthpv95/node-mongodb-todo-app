const { ObjectId } = require("mongodb");
const { Todo } = require("./../../model/todo");
const { User } = require("./../../model/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectId();
const userSecondId = new ObjectId();

const todos = [
  {
    text: "first todo text",
    _id: new ObjectId(),
    _creator: userOneId
  },
  {
    _id: new ObjectId(),
    text: "second todo",
    completedAt: null,
    completed: false,
    _creator: userSecondId
  }
];

const users = [
  {
    _id: userOneId,
    email: "thehienpv@gmail.com",
    password: "userOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: userSecondId,
    email: "lee@gmail.com",
    password: "userTwoPass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userSecondId, access: "auth" }, process.env.JWT_SECRET).toString()
      }
    ]
  }
];

const populateTodos = done => {
  Todo.deleteMany().then(() => {
    Todo.insertMany(todos).then(() => done());
  });
};

const populateUsers = done => {
  User.deleteMany()
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
