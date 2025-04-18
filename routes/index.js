const express = require("express");
const router = express.Router();
const { authenticateUser, storeReturnTo, isAdmin } = require("../middleware");

const AuthController = require("../controllers/AuthController");
const AdminController = require("../controllers/AdminController");


// Authentication Routes

router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.post("/logout", authenticateUser, AuthController.logout);

// Admin Routes (Protected by isAdmin Middleware)
// Admin Menu
router.get("/admin/menu", authenticateUser, isAdmin, AdminController.getAdminMenu);

// Quiz CRUD
router.get("/admin/quiz/new", authenticateUser, isAdmin, AdminController.getNewQuizForm); // Create Quiz Form
router.post("/admin/quiz", authenticateUser, isAdmin, AdminController.postNewQuiz); // Create Quiz
router.get("/admin/quiz/:quizId/edit", authenticateUser, isAdmin, AdminController.getEditQuizForm); // Edit Quiz Form
router.put("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.updateQuiz); // Update Quiz
router.delete("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.deleteQuiz); // Delete Quiz

// Question CRUD (Nested under Quizzes)
router.get("/admin/quiz/:quizId/questions/new", authenticateUser, isAdmin, AdminController.getNewQuestionForm); // Create Question Form
router.post("/admin/quiz/:quizId/questions", authenticateUser, isAdmin, AdminController.postNewQuestion); // Create Question
router.get("/admin/question/:questionId/edit", authenticateUser, isAdmin, AdminController.getEditQuestionForm); // Edit Question Form
router.put("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.updateQuestion); // Update Question
router.delete("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.deleteQuestion); // Delete Question


// User Routes

router.get("/menu", authenticateUser, (req, res) => {
  res.render("menu");
});

router.get("/start-quiz", authenticateUser, (req, res) => {
  res.render("startquiz");
});

module.exports = router;