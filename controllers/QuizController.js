const mongoose = require('mongoose');
const Subject = require('../db/models/subject');
const User = require('../db/models/user');

const QuizController = {
  // Menampilkan semua subject, dengan fitur pencarian dan filter kategori
  getSubjects: async (req, res) => {
    const { search, category } = req.query;

    // Membuat filter berdasarkan pencarian dan kategori
    let filter = {
      name: { $regex: search || "", $options: "i" }
    };

    if (category) {
      filter.category = category;
    }

    try {
      // Mengambil subject berdasarkan filter
      const subjects = await Subject.find(filter);
      // Mengambil semua kategori unik untuk dropdown
      const categories = await Subject.distinct("category");

      res.render('subjects', {
        subjects,
        searchQuery: search || "",
        selectedCategory: category || "",
        categories
      });
    } catch (err) {
      console.error("Gagal mengambil data subject:", err);
      res.status(500).render('error', { message: 'Gagal memuat subject' });
    }
  },

  // Menampilkan kuis berdasarkan subject tertentu
  getQuiz: async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) {
        return res.status(404).render('error', { message: 'Subject tidak ditemukan' });
      }
      res.render('quiz', { subject });
    } catch (err) {
      console.error("Gagal memuat kuis:", err);
      res.status(500).render('error', { message: 'Gagal memuat kuis' });
    }
  },

  // Menangani proses submit kuis dan menyimpan skor ke database
  submitQuiz: async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) {
        return res.status(404).render('error', { message: 'Subject tidak ditemukan' });
      }

      // Pastikan user sudah login
      if (!req.user) {
        req.flash("error", "Anda harus login untuk mengerjakan kuis!");
        return res.redirect("/");
      }

      let score = 0;

      // Memeriksa jawaban user satu per satu
      subject.questions.forEach((question, index) => {
        const userAnswer = parseInt(req.body[`question${index}`], 10);
        if (!isNaN(userAnswer) && userAnswer === question.correct) {
          score++;
        }
      });

      // Cari user berdasarkan ID
      const user = await User.findById(req.user._id);

      // Cek apakah user sudah pernah mengerjakan kuis ini sebelumnya
      const existingScore = user.scores.find(
        entry => entry.subject.toString() === subject._id.toString()
      );

      if (existingScore) {
        // Jika skor baru lebih tinggi, update skor
        if (score > existingScore.score) {
          existingScore.score = score;
        }
      } else {
        // Jika belum pernah, tambahkan skor baru
        user.scores.push({ subject: subject._id, score });
      }

      // Simpan riwayat kuis
      user.attempts.push({
        subject: subject._id,
        score,
        date: new Date()
      });

      await user.save();

      res.render('result', {
        score,
        total: subject.questions.length,
        subjectName: subject.name
      });
    } catch (err) {
      console.error("Error saat submit kuis:", err);
      res.status(500).render('error', { message: 'Gagal submit kuis' });
    }
  },

  // Menampilkan leaderboard/top skor
  getLeaderboard: async (req, res) => {
    try {
      const subjectFilter = req.query.subject;

      // Filter berdasarkan subject jika tersedia
      const matchStage = subjectFilter
        ? { $match: { "scores.subject": new mongoose.Types.ObjectId(subjectFilter) } }
        : { $match: {} };

      const [leaderboard, subjects] = await Promise.all([
        User.aggregate([
          { $unwind: "$scores" },
          matchStage,
          {
            $group: {
              _id: { subject: "$scores.subject", user: "$_id" },
              username: { $first: "$username" },
              totalScore: { $sum: "$scores.score" }
            }
          },
          { $sort: { totalScore: -1 } },
          { $limit: 10 }
        ]),
        Subject.find()
      ]);

      res.render('leaderboard', {
        leaderboard,
        subjects,
        currentSubject: subjectFilter || null
      });
    } catch (err) {
      console.error("Error saat memuat leaderboard:", err);
      res.status(500).render('error', { message: 'Gagal memuat leaderboard' });
    }
  },

  // Menampilkan riwayat kuis user
  getHistory: async (req, res) => {
    try {
      const user = await User
        .findById(req.user._id)
        .populate("attempts.subject", "name");

      res.render("history", { attempts: user.attempts });
    } catch (err) {
      console.error("Error saat mengambil riwayat:", err);
      res.status(500).render('error', { message: 'Gagal memuat riwayat' });
    }
  }
};

module.exports = QuizController;
