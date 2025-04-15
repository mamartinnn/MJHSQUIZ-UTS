const Subject = require("../db/models/subject");
const Question = require("../db/models/question");

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
    const { name } = req.body;
    try {
      await Subject.create({ name, questions: [] });
      req.flash("success", "Quiz created successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to create quiz.");
      res.redirect("/admin/menu");
    }
  },

  getEditQuizForm: async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Subject.findById(quizId).populate("questions");
    res.render("admin/editQuiz", { quiz });
  },

  updateQuiz: async (req, res) => {
    const { quizId } = req.params;
    const { name } = req.body;
    try {
      await Subject.findByIdAndUpdate(quizId, { name });
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
    const question = await Question.findById(questionId);
    res.render("admin/editQuestion", { question });
  },

  updateQuestion: async (req, res) => {
    const { questionId } = req.params;
    const { question, answers, correct } = req.body;
    try {
      await Question.findByIdAndUpdate(questionId, { question, answers, correct });
      req.flash("success", "Question updated successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to update question.");
      res.redirect("/admin/menu");
    }
  },

  deleteQuestion: async (req, res) => {
    const { questionId } = req.params;
    try {
      await Question.findByIdAndDelete(questionId);
      req.flash("success", "Question deleted successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      req.flash("error", "Failed to delete question.");
      res.redirect("/admin/menu");
    }
  },
};

module.exports = AdminController;