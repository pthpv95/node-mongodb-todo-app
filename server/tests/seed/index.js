const { ObjectId } = require("mongodb");
const { Todo } = require("./../../model/todo");
const { User } = require("./../../model/user");
const jwt = require("jsonwebtoken");

const todos = [
  {
    text: "first todo text",
    _id: new ObjectId()
  },
  {
    _id: new ObjectId(),
    text: "second todo",
    completedAt: null,
    completed: false
  }
];

const userOneId = new ObjectId();
const userSecondId = new ObjectId();
const users = [
  {
    _id: userOneId,
    email: "thehienpv@gmail.com",
    password: "userOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: userSecondId,
    email: "lee@gmail.com",
    password: "userTwoPass"
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
    .then(()=>done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
