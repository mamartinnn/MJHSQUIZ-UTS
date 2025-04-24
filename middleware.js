const User = require("./db/models/user");

// Middleware untuk memastikan user sudah login
module.exports.authenticateUser = (req, res, next) => {
  // Jika user sudah login (ada session user_id), lanjut ke route berikutnya
  if (req.session.user_id) {
    return next();
  }

  // Simpan URL tujuan sebelum diarahkan ke login, agar bisa redirect kembali setelah login
  if (req.originalUrl !== "/logout") {
    req.session.returnTo = req.originalUrl;
  }

  // Tampilkan pesan error dan redirect ke halaman login
  req.flash('error', 'Anda harus login untuk mengakses halaman ini!');
  res.redirect(302, "/");
};

// Middleware untuk menyimpan URL yang ingin dikunjungi sebelum login
module.exports.storeReturnTo = (req, res, next) => {
  // Jika ada session returnTo, simpan ke res.locals agar bisa digunakan setelah login
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
}

// Middleware untuk memverifikasi apakah user adalah admin
module.exports.isAdmin = async (req, res, next) => {
  try {
    // Cek apakah user sudah login
    if (!req.session.user_id) {
      req.flash("error", "Anda harus login terlebih dahulu!");
      return res.redirect(302, "/");
    }

    // Cari data user berdasarkan ID dari session
    const user = await User.findById(req.session.user_id);

    // Jika user tidak ditemukan di database
    if (!user) {
      req.flash("error", "User tidak ditemukan!");
      return res.redirect(302, "/");
    }

    // Jika username adalah 'admin', lanjut ke route berikutnya
    if (user.username === "admin") {
      return next();
    }

    // Jika bukan admin, tampilkan pesan error dan redirect ke menu user biasa
    req.flash("error", "Anda tidak memiliki izin untuk mengakses halaman ini!");
    return res.redirect(302, "/menu");
  } catch (err) {
    // Tangani error internal server
    console.error(err);
    req.flash("error", "Terjadi kesalahan pada server!");
    res.redirect(302, "/");
  }
};
