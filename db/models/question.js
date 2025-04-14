const questionSchema = new Schema(
    {
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
    },
    { timestamps: true }
  );