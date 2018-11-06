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

    db.collection("Users")
      .find({ name: "lee" })
      .toArray()
      .then(docs => {
        console.log(docs);
      });

    client.close();
  }
);
