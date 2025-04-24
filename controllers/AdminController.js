const Subject = require("../db/models/subject");
const User = require("../db/models/user");
const bcrypt = require("bcrypt");

const AdminController = {
  // Menu Admin
  getAdminMenu: async (req, res) => {
    const subjects = await Subject.find({});
    res.render("admin/menu", { subjects });
  },

  // CRUD Kuis
  getNewQuizForm: (req, res) => {
    res.render("admin/newQuiz");
  },

  // Membuat kuis baru
  postNewQuiz: async (req, res) => {
    const { name, category } = req.body; // Mengambil nama dan kategori dari form
    try {
      await Subject.create({ name, category, questions: [] });
      req.flash("success", "Kuis berhasil dibuat!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Gagal membuat kuis.");
      res.redirect("/admin/menu")
      console.log(err);
    }
  },

  // Menampilkan form edit kuis
  getEditQuizForm: async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Subject.findById(quizId).populate("questions");
    res.render("admin/editQuiz", { quiz });
  },

  // Memperbarui data kuis
  updateQuiz: async (req, res) => {
    const { quizId } = req.params;
    const { name, category } = req.body; // Sekarang juga mengambil kategori
    try {
      await Subject.findByIdAndUpdate(quizId, { name, category }); // Update nama dan kategori
      req.flash("success", "Kuis berhasil diperbarui!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Gagal memperbarui kuis.");
      res.redirect("/admin/menu");
    }
  },

  // Menghapus kuis
  deleteQuiz: async (req, res) => {
    const { quizId } = req.params;
    try {
      await Subject.findByIdAndDelete(quizId);
      req.flash("success", "Kuis berhasil dihapus!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Gagal menghapus kuis.");
      res.redirect("/admin/menu");
    }
  },

  // CRUD Pertanyaan
  getNewQuestionForm: (req, res) => {
    const { quizId } = req.params;
    res.render("admin/newQuestion", { quizId });
  },

  // Membuat pertanyaan baru
  postNewQuestion: async (req, res) => {
    const { quizId } = req.params;
    const { question, answers, correct } = req.body;
    try {
      const newQuestion = { question, answers, correct };
      await Subject.findByIdAndUpdate(quizId, { $push: { questions: newQuestion } });
      req.flash("success", "Pertanyaan berhasil ditambahkan!");
      res.redirect(`/admin/quiz/${quizId}/edit`);
    } catch (err) {
      req.flash("error", "Gagal menambahkan pertanyaan.");
      res.redirect(`/admin/quiz/${quizId}/edit`);
    }
  },

  // Menampilkan form edit pertanyaan
  getEditQuestionForm: async (req, res) => {
    const { questionId } = req.params;
    try {
      const subject = await Subject.findOne({ "questions._id": questionId });
      if (!subject) {
        req.flash("error", "Pertanyaan tidak ditemukan!");
        return res.redirect("/admin/menu");
      }

      const question = subject.questions.id(questionId);
      if (!question) {
        req.flash("error", "Pertanyaan tidak ditemukan!");
        return res.redirect("/admin/menu");
      }

      res.render("admin/editQuestion", { question });
    } catch (err) {
      console.error(err);
      req.flash("error", "Terjadi kesalahan saat memuat pertanyaan.");
      res.redirect("/admin/menu");
    }
  },

  // Memperbarui pertanyaan
  updateQuestion: async (req, res) => {
    const { questionId } = req.params;
    const { question, answers, correct } = req.body;

    try {
      await Subject.findOneAndUpdate(
        { "questions._id": questionId },
        {
          $set: {
            "questions.$.question": question,
            "questions.$.answers": answers,
            "questions.$.correct": correct,
          },
        }
      );

      req.flash("success", "Pertanyaan berhasil diperbarui!");
      res.redirect("/admin/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "Gagal memperbarui pertanyaan.");
      res.redirect("/admin/menu");
    }
  },

  // Menghapus pertanyaan
  deleteQuestion: async (req, res) => {
    const { questionId } = req.params;
    try {
      await Subject.findOneAndUpdate(
        { "questions._id": questionId },
        { $pull: { questions: { _id: questionId } } }
      );

      req.flash("success", "Pertanyaan berhasil dihapus!");
      res.redirect("/admin/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "Gagal menghapus pertanyaan.");
      res.redirect("/admin/menu");
    }
  },

  // CRUD Pengguna dengan Pencarian
  getAllUsers: async (req, res) => {
    const search = req.query.search || "";
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};

      const users = await User.find(query);
      res.render("admin/users", { users, search });
    } catch (err) {
      req.flash("error", "Gagal mengambil data pengguna.");
      res.redirect("/admin/menu");
    }
  },

  // Menghapus pengguna
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      await User.findByIdAndDelete(userId);
      req.flash("success", "Pengguna berhasil dihapus!");
      res.redirect("/admin/users");
    } catch (err) {
      req.flash("error", "Gagal menghapus pengguna.");
      res.redirect("/admin/users");
    }
  },

  // Menampilkan form edit pengguna
  getEditUserForm: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        req.flash("error", "Pengguna tidak ditemukan!");
        return res.redirect("/admin/users");
      }
      res.render("admin/editUser", { user });
    } catch (err) {
      req.flash("error", "Error saat memuat pengguna.");
      res.redirect("/admin/users");
    }
  },

  // Memperbarui password pengguna
  updateUserPassword: async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      req.flash("success", "Password berhasil diperbarui!");
      res.redirect("/admin/users");
    } catch (err) {
      console.error(err);
      req.flash("error", "Gagal memperbarui password.");
      res.redirect("/admin/users");
    }
  },
};

module.exports = AdminController;