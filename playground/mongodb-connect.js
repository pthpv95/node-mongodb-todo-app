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

    // db.collection("TodoApp").insertOne(
    //   {
    //     text: "Learn mongodb and node",
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log("Unable to insert todo", err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    db.collection("Users").insertOne(
      {
        name: "lee",
        age: 23,
        location: "Bangkok, Thailand"
      },
      (err, result) => {
        if (err) {
          return console.log("Unable to insert user", err);
        }

        // console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    client.close();
  }
);
