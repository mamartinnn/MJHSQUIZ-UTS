const express = require('express');
const path = require('path'); // Untuk menangani path file dan direktori
const app = express();
const methodOverride = require("method-override"); // Untuk mendukung method PUT & DELETE dari form HTML
const session = require("express-session"); // Untuk session management
const flash = require("connect-flash"); // Untuk menampilkan pesan sementara (flash messages)
const indexRouter = require("./routes/index"); // Import router utama
const mongoose = require("mongoose");
const User = require("./db/models/user");

// Aktifkan method override, supaya bisa pakai method PUT & DELETE lewat form
app.use(methodOverride("_method"));

// Koneksi ke MongoDB
const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/Login-tut'); // Ganti sesuai nama database kamu
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Error connecting to DB:", err));

// Middleware untuk parsing data dari form dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine menggunakan EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set folder 'views' sebagai tempat file EJS

// Menyediakan file statis (CSS, JS, gambar, dll) dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi session
app.use(session({
  secret: "supersecretkey", // Ganti dengan secret key yang lebih aman di production
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true } // Meningkatkan keamanan agar cookie tidak bisa diakses oleh client-side JS
}));

// Aktifkan flash message
app.use(flash());

// Middleware untuk mengambil user dari session dan membuatnya tersedia di setiap view
app.use(async (req, res, next) => {
  if (req.session.user_id) {
    const user = await User.findById(req.session.user_id); // Cari user berdasarkan ID di session
    res.locals.user = user; // Supaya bisa dipakai di view
    req.user = user; // Supaya bisa dipakai di controller
  } else {
    res.locals.user = null;
  }
  next();
});

// Middleware untuk membuat flash message tersedia di semua view
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Gunakan router utama
app.use("/", indexRouter);

// Jalankan server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
