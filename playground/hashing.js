const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var message = "I am lee";

// var hashing = SHA256(message).toString();

// console.log("message", message);
// console.log("hashing", hashing);

var data = {
  id: 7
};

var token = jwt.sign(data, "123abc");
// console.log(token);

var decoded = jwt.verify(token, "123abc");
// console.log(decoded);

var password = "123Abc!";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});
