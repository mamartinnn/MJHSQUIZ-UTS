// Import model User dari database
const User = require("./db/models/user");

// Middleware untuk mengecek apakah user sudah login
module.exports.authenticateUser = (req, res, next) => {
  // Jika user sudah login (ada session user_id)
  if (req.session.user_id) {
    return next(); // Lanjut ke route berikutnya
  }

  // Jika user belum login dan bukan di halaman logout
  if (req.originalUrl !== "/logout") {
    req.session.returnTo = req.originalUrl; // Simpan URL yang ingin diakses
  }

  // Tampilkan pesan error dan redirect ke halaman utama/login
  req.flash('error', 'You have to logged in to see the page!');
  res.redirect(302, "/");
};

// Middleware untuk menyimpan URL tujuan ke variabel lokal
module.exports.storeReturnTo = (req, res, next) => {
  // Jika ada returnTo di session, simpan ke res.locals agar bisa dipakai di view/controller
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next(); // Lanjut ke middleware berikutnya
};

// Middleware untuk mengecek apakah user adalah admin
module.exports.isAdmin = async (req, res, next) => {
  try {
    // Pastikan user sudah login
    if (!req.session.user_id) {
      req.flash("error", "You must be logged in!");
      return res.redirect(302, "/");
    }

    // Ambil data user dari database berdasarkan ID di session
    const user = await User.findById(req.session.user_id);

    // Jika user tidak ditemukan
    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect(302, "/");
    }

    // Jika user adalah admin (dalam contoh ini, dicek dari username)
    if (user.username === "admin") {
      return next(); // Izinkan akses
    }

    // Jika user bukan admin, tolak akses
    req.flash("error", "You do not have the required permissions!");
    return res.redirect(302, "/menu");
  } catch (err) {
    // Jika terjadi error dalam proses
    console.error(err);
    req.flash("error", "An error occurred!");
    res.redirect(302, "/");
  }
};
