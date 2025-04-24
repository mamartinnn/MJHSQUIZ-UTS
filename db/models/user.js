// Mengimpor Schema dan model dari mongoose
const { Schema, model } = require("mongoose");

// Membuat skema untuk user
const userSchema = new Schema({
  // Username wajib diisi dan harus unik
  username: {
    type: String,
    required: true,
    unique: true
  },

  // Password wajib diisi
  password: {
    type: String,
    required: true
  },

  // Menyimpan skor dari beberapa mata pelajaran
  scores: [{
    // Referensi ke koleksi Subject
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject'
    },
    // Nilai untuk subject tersebut
    score: Number
  }],

  // Menyimpan riwayat percobaan quiz user
  attempts: [{
    // Referensi ke koleksi Subject
    subject: { 
      type: Schema.Types.ObjectId, 
      ref: "Subject" 
    },
    // Nilai yang didapat dalam percobaan
    score: Number,
    // Tanggal dan waktu quiz, default-nya adalah saat data dibuat
    takenAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
});

// Membuat model User dari skema yang sudah didefinisikan
const User = model("User", userSchema);

// Mengekspor model agar bisa digunakan di file lain
module.exports = User;
