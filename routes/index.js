const express = require("express");
const router = express.Router();
const Subject = require("../db/models/subject");
const User = require("../db/models/user");
const { authenticateUser, storeReturnTo, isAdmin } = require("../middleware");

const AuthController = require("../controllers/AuthController");
const AdminController = require("../controllers/AdminController");
const QuizController = require("../controllers/QuizController"); // Add QuizController

// Authentication Routes
router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.post("/logout", authenticateUser, AuthController.logout);

// Admin Routes
router.get("/admin/menu", authenticateUser, isAdmin, AdminController.getAdminMenu);
router.get("/admin/users", authenticateUser, isAdmin, AdminController.getAllUsers);
router.delete("/admin/users/:userId", authenticateUser, isAdmin, AdminController.deleteUser);
router.get("/admin/users/:userId/edit", authenticateUser, isAdmin,AdminController.getEditUserForm);
router.post("/admin/users/:userId/update-password",authenticateUser, isAdmin, AdminController.updateUserPassword);


// Quiz CRUD
router.get("/admin/quiz/new", authenticateUser, isAdmin, AdminController.getNewQuizForm);
router.post("/admin/quiz", authenticateUser, isAdmin, AdminController.postNewQuiz);
router.get("/admin/quiz/:quizId/edit", authenticateUser, isAdmin, AdminController.getEditQuizForm);
router.put("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.updateQuiz);
router.delete("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.deleteQuiz);

// Question CRUD
router.get("/admin/quiz/:quizId/questions/new", authenticateUser, isAdmin, AdminController.getNewQuestionForm);
router.post("/admin/quiz/:quizId/questions", authenticateUser, isAdmin, AdminController.postNewQuestion);
router.get("/admin/question/:questionId/edit", authenticateUser, isAdmin, AdminController.getEditQuestionForm);
router.put("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.updateQuestion);
router.post("/admin/question/:questionId/update", authenticateUser, isAdmin, AdminController.updateQuestion);
router.delete("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.deleteQuestion);

// User Routes
router.get("/menu", authenticateUser, (req, res) => {
  res.render("menu");
});

router.get("/start-quiz", authenticateUser, (req, res) => {
  res.render("startquiz");
});

// Quiz Routes (using QuizController)
router.get("/subjects", authenticateUser, QuizController.getSubjects);
router.get("/quiz/:subjectId", authenticateUser, QuizController.getQuiz);
router.post("/submit-quiz/:subjectId", authenticateUser, QuizController.submitQuiz);
router.get("/leaderboard", authenticateUser, QuizController.getLeaderboard);
router.get("/history", authenticateUser, QuizController.getHistory);

module.exports = router;