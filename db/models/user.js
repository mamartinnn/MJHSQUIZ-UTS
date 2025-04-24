// user.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  scores: [{
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject'
    },
    score: Number
  }]
});

const User = model("User", userSchema);
module.exports = User;