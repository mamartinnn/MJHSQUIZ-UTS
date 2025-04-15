const express = require("express");  
const router = express.Router();
const { authenticateUser, storeReturnTo, isAdmin } = require("../middleware");

const AuthController = require("../controllers/AuthController");
router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.post("/logout", authenticateUser, AuthController.logout);
const AdminController = require("../controllers/AdminController");

// Admin-specific routes (protected by isAdmin middleware)
router.get("/admin/menu", authenticateUser, isAdmin, AdminController.getAdminMenu);
router.get("/admin/quiz/new", authenticateUser, isAdmin, AdminController.getNewQuizForm);
router.post("/admin/quiz", authenticateUser, isAdmin, AdminController.postNewQuiz);
router.get("/admin/quiz/:quizId/edit", authenticateUser, isAdmin, AdminController.getEditQuizForm);
router.put("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.updateQuiz);
router.delete("/admin/quiz/:quizId", authenticateUser, isAdmin, AdminController.deleteQuiz);

// Question CRUD (nested under quizzes)
router.get("/admin/quiz/:quizId/questions/new", authenticateUser, isAdmin, AdminController.getNewQuestionForm);
router.post("/admin/quiz/:quizId/questions", authenticateUser, isAdmin, AdminController.postNewQuestion);
router.get("/admin/question/:questionId/edit", authenticateUser, isAdmin, AdminController.getEditQuestionForm);
router.put("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.updateQuestion);
router.delete("/admin/question/:questionId", authenticateUser, isAdmin, AdminController.deleteQuestion);


router.get("/menu", authenticateUser, (req, res) => {
  res.render("menu");
});

router.get("/start-quiz", authenticateUser, (req, res) => {
  res.render("startquiz");
});

// Protect the edit-quiz route with isAdmin middleware
router.get("/edit-quiz", authenticateUser, isAdmin, (req, res) => {
  res.render("editquiz");
});

module.exports = router;