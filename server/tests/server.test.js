var expect = require("expect");
var request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../model/todo");

const todos = [
  {
    text: "first todo text",
    _id: new ObjectId()
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

describe("GET /todos/:id", () => {
  it("should return todo when pass valid id", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    const hexId = new ObjectId().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object id", done => {
    const id = '123'
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});
