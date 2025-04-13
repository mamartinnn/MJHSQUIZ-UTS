const express = require("express");  
const router = express.Router();
const { authenticateUser, storeReturnTo, isAdmin } = require("../middleware");

const AuthController = require("../controllers/AuthController");
router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.post("/logout", authenticateUser, AuthController.logout);

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