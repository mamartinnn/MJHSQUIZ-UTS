// Mengimpor semua modul yang dibutuhkan
const express = require('express');
const path = require('path'); // Untuk mengatur path direktori dan file
const app = express();
const methodOverride = require("method-override"); // Memungkinkan penggunaan metode HTTP selain GET dan POST (misal PUT & DELETE)
const session = require("express-session"); // Untuk membuat sesi login pengguna
const flash = require("connect-flash"); // Untuk menyimpan pesan sementara (misalnya notifikasi berhasil/gagal)
const indexRouter = require("./routes/index"); // Mengimpor router dari folder routes
const mongoose = require("mongoose"); // ODM untuk menghubungkan ke MongoDB
const User = require("./db/models/user"); // Model untuk data user

// Middleware untuk override metode HTTP menggunakan query _method
app.use(methodOverride("_method"));

// Fungsi utama untuk menghubungkan ke database MongoDB lokal
const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/Login-tut'); // Nama database: Login-tut
};

// Menjalankan koneksi database dan log hasilnya
main()
  .then(() => console.log("Connected to DB")) // Jika berhasil
  .catch((err) => console.log("Error connecting to DB:", err)); // Jika gagal

// Middleware untuk parsing data dari form (x-www-form-urlencoded) dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Konfigurasi view engine menggunakan EJS
app.set('view engine', 'ejs'); // Template engine
app.set('views', path.join(__dirname, 'views')); // Folder penyimpanan file .ejs

// Middleware untuk melayani file statis seperti CSS, JS, gambar dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi session
app.use(session({
  secret: "supersecretkey", // Kunci rahasia untuk mengenkripsi session
  resave: false,            // Tidak menyimpan session jika tidak diubah
  saveUninitialized: true,  // Simpan session walaupun belum dimodifikasi
  cookie: { httpOnly: true } // Menjaga keamanan dengan mencegah akses cookie dari client-side JS
}));

// Middleware flash message
app.use(flash());

// Middleware untuk autentikasi pengguna
app.use(async (req, res, next) => {
  if (req.session.user_id) { // Jika user login (user_id ada di session)
    const user = await User.findById(req.session.user_id); // Ambil data user dari database
    res.locals.user = user; // Kirim data user ke semua view (EJS)
    req.user = user;        // Simpan user ke dalam request agar bisa digunakan di route
  } else {
    res.locals.user = null; // Jika tidak login, user null
  }
  next(); // Lanjut ke middleware berikutnya
});

// Middleware untuk menyimpan pesan flash ke variabel lokal (EJS)
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Pesan sukses
  res.locals.error = req.flash("error");     // Pesan error
  next();
});

// Gunakan router utama untuk menangani semua route awal
app.use("/", indexRouter);

// Jalankan server di port 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
