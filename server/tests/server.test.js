var expect = require("expect");
var request = require("supertest");
const { ObjectId } = require("mongodb");
const { app } = require("../server");
const { Todo } = require("../model/todo");
const { User } = require("../model/user");
const { todos, populateTodos, populateUsers, users } = require("./seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

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
    const hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object id", done => {
    const id = "123";
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete todo when match id in db", done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(doc => {
            expect(doc).toNotExist();
            done();
          })
          .catch(err => {
            done();
          });
      });
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .delete("/todos/123")
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update todo", done => {
    const hexId = todos[1]._id.toHexString();
    const text = "updated todo";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: true, text: text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should return 404 if todo not completed", done => {
    const hexId = todos[1]._id.toHexString();
    const text = "todo text";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: false, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    const token = users[0].tokens[0].token;
    request(app)
      .get("/users/me")
      .set("x-auth", token.toString())
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create new user", done => {
    const payload = {
      email: "abc@yahoo.com",
      password: "123!abc"
    };
    request(app)
      .post("/users")
      .send({ ...payload })
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(payload.email);
      })
      .end(done);
  });

  it("should return validation errors if request invalid", done => {
    const payload = {
      email: "abc.yahoo.com",
      password: "123!abc"
    };
    request(app)
      .post("/users")
      .send({ ...payload })
      .expect(400)
      .end(done);
  });

  it("should not create user when email in use", done => {
    const payload = {
      email: users[0].email,
      password: "123!abc"
    };
    request(app)
      .post("/users")
      .send({ ...payload })
      .expect(400)
      .end(done);
  });
});

describe("POST users/login", () => {
  it("should login return user and token", done => {
    const email = users[0].email;
    const password = users[0].password;
    request(app)
      .post("/users/login")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(email);
        expect(res.header["x-auth"]).not.toBe(null);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id).then(user => {
          expect(user.tokens[0].token).toEqual(user.tokens[0].token);
          done();
        });
      });
  });

  it("should reject invalid login", done => {
    const email = users[0].email;
    const password = "wrongpassword";
    request(app)
      .post("/users/login")
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on log out", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done();
        }

        User.findOne({ _id: users[0].tokens[0].token })
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});
