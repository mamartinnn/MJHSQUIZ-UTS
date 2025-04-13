const express = require("express");  
const router = express.Router();
const { authenticateUser, storeReturnTo } = require("../middleware");

const AuthController = require("../controllers/AuthController");
router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);
router.post("/logout", authenticateUser, AuthController.logout);


router.get("/menu", (req, res) => {
   res.render("menu")
});


module.exports = router;