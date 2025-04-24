const bcrypt = require("bcrypt");
const User = require("../db/models/user");
const { userValidationSchema } = require("../validation/userValidationSchema");

const AuthController = {
  // Menampilkan halaman pendaftaran
  getSignUp: (req, res) => {
    res.render("signup");
  },

  // Proses pendaftaran pengguna baru
  postSignUp: async (req, res, next) => {
    const { username, password, passwordRepeat } = req.body;

    // Validasi input menggunakan Joi schema
    const { error } = userValidationSchema.validate({
      username,
      password,
      passwordRepeat,
    });

    // Jika validasi gagal
    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      req.flash("error", messages);
      return res.redirect(302, "/signup");
    }

    // Cek apakah username sudah terdaftar
    let foundUser;
    try {
      foundUser = await User.find({ username });
      console.log(foundUser);
    } catch (err) {
      req.flash("error", err.message);
      return res.redirect(302, "/signup");
    }

    // Jika username sudah ada
    if (foundUser && foundUser.length > 0) {
      console.log("in foundUser", foundUser);
      req.flash("error", "Username sudah digunakan!");
      return res.redirect(302, "/signup");
    }

    // Hash password sebelum disimpan
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = {
      username,
      password: hash,
      scores: [], // Inisialisasi array scores kosong
    };

    // Membuat user baru
    let user;
    try {
      user = await User.create(newUser);
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/signup");
    }

    // Jika pendaftaran berhasil
    if (user) {
      req.session.user_id = user._id; // Set session
      req.flash(
        "success",
        "Akun Anda berhasil dibuat"
      );
      return res.redirect(302, "/");
    } else {
      req.flash("error", "Terjadi kesalahan, silakan coba lagi nanti!");
      return res.redirect(302, "/signup");
    }
  },

  // Menampilkan halaman login
  getLogin: (req, res) => {
    res.render("login");
  },

  // Proses login pengguna
  postLogin: async (req, res, next) => {
    const { username, password } = req.body;

    // Validasi input tidak kosong
    if (!username || !password) {
      req.flash("error", "Username atau password tidak boleh kosong!");
      return res.redirect(302, "/");
    }

    // Cari user di database
    let foundUser;
    try {
      foundUser = await User.findOne({ username });
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/");
    }

    // Jika user tidak ditemukan
    if (!foundUser) {
      req.flash("error", "Username atau password salah!");
      return res.redirect(302, "/");
    }

    // Verifikasi password
    const confirmPassword = await bcrypt.compare(password, foundUser.password);
    if (!confirmPassword) {
      req.flash("error", "Username atau password salah!");
      return res.redirect(302, "/");
    }
    
    // Set session dan data user
    req.session.user_id = foundUser._id;
    res.locals.user = foundUser;
    req.flash("success", `Selamat datang ${foundUser.username}!`);

    // Redirect khusus untuk admin
    if (foundUser.username === 'admin') {
      return res.redirect('/admin/menu');
    }
    
    // Redirect ke halaman yang diminta atau menu utama
    const redirectUrl = res.locals.returnTo || "/menu";
    res.redirect(302, redirectUrl);
  },
  
  // Proses logout
  logout: (req, res) => {
    req.session.user_id = null; // Hapus session
    req.flash("success", "Anda berhasil logout");
    res.redirect("/");
  },
};

module.exports = AuthController;