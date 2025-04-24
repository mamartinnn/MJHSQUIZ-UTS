const mongoose = require('mongoose');
const Subject = require('../db/models/subject');
const User = require('../db/models/user');

const QuizController = {
  // Get all subjects (with optional search)
  getSubjects: async (req, res) => {
    const searchQuery = req.query.search || "";
    try {
      const subjects = await Subject.find({
        name: { $regex: searchQuery, $options: "i" }
      });
      res.render('subjects', { subjects, searchQuery });
    } catch (err) {
      console.error("Error fetching subjects:", err);
      res.status(500).render('error', { message: 'Failed to load subjects' });
    }
  },

  // Get quiz for a specific subject
  getQuiz: async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) {
        return res.status(404).render('error', { message: 'Subject not found' });
      }
      res.render('quiz', { subject });
    } catch (err) {
      console.error("Error loading quiz:", err);
      res.status(500).render('error', { message: 'Failed to load quiz' });
    }
  },

  // Handle quiz submission and score saving
  submitQuiz: async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) {
        return res.status(404).render('error', { message: 'Subject not found' });
      }

      if (!req.user) {
        req.flash("error", "You must be logged in to submit a quiz!");
        return res.redirect("/");
      }

      let score = 0;

      // Check answers
      subject.questions.forEach((question, index) => {
        const userAnswer = parseInt(req.body[`question${index}`], 10);
        if (!isNaN(userAnswer) && userAnswer === question.correct) {
          score++;
        }
      });

      const user = await User.findById(req.user._id);
      const existingScore = user.scores.find(
        entry => entry.subject.toString() === subject._id.toString()
      );

      if (existingScore) {
        if (score > existingScore.score) {
          existingScore.score = score;
          await user.save();
        }
      } else {
        user.scores.push({ subject: subject._id, score });
        await user.save();
      }

      res.render('result', {
        score,
        total: subject.questions.length,
        subjectName: subject.name
      });
    } catch (err) {
      console.error("Submit Quiz Error:", err);
      res.status(500).render('error', { message: 'Failed to submit quiz' });
    }
  },

  // Display leaderboard (optionally filter by subject)
  getLeaderboard: async (req, res) => {
    try {
      const subjectFilter = req.query.subject;
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
      console.error("Leaderboard Error:", err);
      res.status(500).render('error', { message: 'Failed to load leaderboard' });
    }
  }
};

module.exports = QuizController;