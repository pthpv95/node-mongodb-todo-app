const { mongose } = require("../server/db/mongoose");
const { Todo } = require("../server/model/todo");

var id = "123";

Todo.findById(id)
  .then(doc => {
    console.log(doc);
  })
  .catch(e => {
    console.log(e);
  });
