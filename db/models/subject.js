const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
  question: {
    type: String,
    required: [true, "Question must not be empty!"],
  },
  answers: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 4; // Ensure exactly 4 answers
      },
      message: "There must be exactly 4 answers!",
    },
  },
  correct: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3], // Only 0-3 are valid
  },
});

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [questionSchema], // Embed the question schema
  },
  { timestamps: true }
);

const Subject = model("Subject", subjectSchema);
module.exports = Subject;