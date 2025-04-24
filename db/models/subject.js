// Import Schema dan model dari Mongoose
const { Schema, model } = require("mongoose");

// Schema untuk soal (question)
const questionSchema = new Schema({
  // Pertanyaan kuis
  question: {
    type: String,
    required: [true, "Question must not be empty!"], // Wajib diisi
  },
  // Pilihan jawaban 
  answers: {
    type: [String], // Array of String
    validate: {
      validator: function (v) {
        return v.length === 4; // Validasi: harus tepat 4 pilihan jawaban
      },
      message: "There must be exactly 4 answers!", // Pesan jika validasi gagal
    },
  },
  // Jawaban yang benar, berupa index dari array 'answers'
  correct: {
    type: Number,
    required: true, // Wajib diisi
    enum: [0, 1, 2, 3], // Harus salah satu dari 0, 1, 2, 3
  },
});

// Schema untuk subjek/mata pelajaran
const subjectSchema = new Schema(
  {
    // Nama subjek (misalnya: Matematika, Biologi, dll)
    name: {
      type: String,
      required: true, // Wajib diisi
    },
    // Kumpulan soal untuk subjek ini
    questions: [questionSchema], // Embed questionSchema (1 subject bisa punya banyak soal)
  },
  {
    timestamps: true, // Otomatis tambahkan createdAt dan updatedAt
  }
);

// Menambahkan field 'category' ke subjectSchema
subjectSchema.add({
  category: {
    type: String,
    required: true, // Kategori wajib diisi
  },
});

// Membuat model Subject dari schema-nya
const Subject = model("Subject", subjectSchema);

// Export model supaya bisa digunakan di file lain
module.exports = Subject;
