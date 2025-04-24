const Subject = require("../db/models/subject");
const User = require("../db/models/user");
const bcrypt = require("bcrypt");

const AdminController = {
  // Admin Menu
  getAdminMenu: async (req, res) => {
    const subjects = await Subject.find({});
    res.render("admin/menu", { subjects });
  },

  // Quiz CRUD
  getNewQuizForm: (req, res) => {
    res.render("admin/newQuiz");
  },

  postNewQuiz: async (req, res) => {
    const { name , category } = req.body;
    try {
      await Subject.create({ name,category, questions: [] });
      req.flash("success", "Quiz created successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to create quiz.");
      res.redirect("/admin/menu")
      console.log(err);
    }
  },

  getEditQuizForm: async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Subject.findById(quizId).populate("questions");
    res.render("admin/editQuiz", { quiz });
  },

  updateQuiz: async (req, res) => {
    const { quizId } = req.params;
    const { name , category } = req.body;
    try {
      await Subject.findByIdAndUpdate(quizId, { name , category});
      req.flash("success", "Quiz updated successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to update quiz.");
      res.redirect("/admin/menu");
    }
  },

  deleteQuiz: async (req, res) => {
    const { quizId } = req.params;
    try {
      await Subject.findByIdAndDelete(quizId);
      req.flash("success", "Quiz deleted successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to delete quiz.");
      res.redirect("/admin/menu");
    }
  },

  // Question CRUD
  getNewQuestionForm: (req, res) => {
    const { quizId } = req.params;
    res.render("admin/newQuestion", { quizId });
  },

  postNewQuestion: async (req, res) => {
    const { quizId } = req.params;
    const { question, answers, correct } = req.body;
    try {
      const newQuestion = { question, answers, correct };
      await Subject.findByIdAndUpdate(quizId, { $push: { questions: newQuestion } });
      req.flash("success", "Question added successfully!");
      res.redirect(`/admin/quiz/${quizId}/edit`);
    } catch (err) {
      req.flash("error", "Failed to add question.");
      res.redirect(`/admin/quiz/${quizId}/edit`);
    }
  },

  getEditQuestionForm: async (req, res) => {
    const { questionId } = req.params;
    try {
      const subject = await Subject.findOne({ "questions._id": questionId });
      if (!subject) {
        req.flash("error", "Question not found!");
        return res.redirect("/admin/menu");
      }

      const question = subject.questions.id(questionId);
      if (!question) {
        req.flash("error", "Question not found!");
        return res.redirect("/admin/menu");
      }

      res.render("admin/editQuestion", { question });
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred while loading the question.");
      res.redirect("/admin/menu");
    }
  },

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

      req.flash("success", "Question updated successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to update question.");
      res.redirect("/admin/menu");
    }
  },

  deleteQuestion: async (req, res) => {
    const { questionId } = req.params;
    try {
      await Subject.findOneAndUpdate(
        { "questions._id": questionId },
        { $pull: { questions: { _id: questionId } } }
      );

      req.flash("success", "Question deleted successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to delete question.");
      res.redirect("/admin/menu");
    }
  },

  // User CRUD with Search
  getAllUsers: async (req, res) => {
    const search = req.query.search || "";
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};

      const users = await User.find(query);
      res.render("admin/users", { users, search });
    } catch (err) {
      req.flash("error", "Failed to fetch users.");
      res.redirect("/admin/menu");
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      await User.findByIdAndDelete(userId);
      req.flash("success", "User deleted successfully!");
      res.redirect("/admin/users");
    } catch (err) {
      req.flash("error", "Failed to delete user.");
      res.redirect("/admin/users");
    }
  },

  getEditUserForm: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/admin/users");
      }
      res.render("admin/editUser", { user });
    } catch (err) {
      req.flash("error", "Error loading user.");
      res.redirect("/admin/users");
    }
  },

  updateUserPassword: async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      req.flash("success", "Password updated successfully!");
      res.redirect("/admin/users");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to update password.");
      res.redirect("/admin/users");
    }
  },
};

module.exports = AdminController;