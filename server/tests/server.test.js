var expect = require("expect");
var request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../model/todo");

const todos = [
  {
    text: "first todo text"
  },
  {
    text: "second todo"
  }
];
beforeEach(done => {
  Todo.deleteMany().then(() => {
    Todo.insertMany(todos).then(() => done());
  });
});

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "create todo for testing";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            console.log(todos);

            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => {
            return done(err);
          });
      });
  });

  it("should note create new todo", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done();
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => {
            done();
          });
      });
  });
});

describe("GET /todos ", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end((err, res) => {
        done();
      });
  });
});
