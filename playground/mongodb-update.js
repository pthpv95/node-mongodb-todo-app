const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to db");
    } else {
      console.log("Connect to MongoDb server successful");
    }

    const db = client.db("TodoApp");

    db.collection("Todos")
      .findOneAndUpdate(
        { _id: ObjectID("5bddbac2bdc6d61865666d80") },
        {
          $set: { completed: true }
        },
        {
          returnOriginal: false
        }
      )
      .then(docs => {
        console.log(docs);
      });

    client.close();
  }
);
