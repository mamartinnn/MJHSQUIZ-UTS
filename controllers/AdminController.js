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
  
    try {
      // Find the subject that contains the question
      const subject = await Subject.findOne({ "questions._id": questionId });
      if (!subject) {
        req.flash("error", "Question not found!");
        return res.redirect("/admin/menu");
      }
  
      // Find the specific question in the subject's questions array
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
      // Update the specific question in the questions array
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
      // Remove the question from the questions array
      await Subject.findOneAndUpdate(
        { "questions._id": questionId },
        {
          $pull: { questions: { _id: questionId } },
        }
      );
  
      req.flash("success", "Question deleted successfully!");
      res.redirect("/admin/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to delete question.");
      res.redirect("/admin/menu");
    }
  },
};

module.exports = AdminController;