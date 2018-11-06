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

    // db.collection("Todos")
    //   .deleteMany({ text: "eat lunch" })
    //   .then(docs => {
    //     console.log(docs);
    //   });

    // db.collection("Todos")
    //   .findOneAndDelete({ _id: ObjectID("5bde751741a1c71665557cf6") })
    //   .then(docs => {
    //     console.log(docs);
    //   });

    client.close();
  }
);
