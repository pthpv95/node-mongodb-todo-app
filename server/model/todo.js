const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var todoSchema = new Schema({
  text: {
    type: String,
    // required: true,
    minlength: 2
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});
module.exports = {
  Todo: mongoose.model("Todo", todoSchema)
};
