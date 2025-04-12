const express = require("express");  
const router = express.Router();
const { authenticateUser, storeReturnTo } = require("../middleware");

const AuthController = require("../controllers/AuthController");
router.get("/", AuthController.getLogin);
router.post("/", storeReturnTo, AuthController.postLogin);
router.get("/signup", AuthController.getSignUp);
router.post("/signup", AuthController.postSignUp);

router.get("/menu", (req, res) => {
    const user = mockUsers.find(u => u.id === req.session.user_id);
    const username = user ? user.username : "Guest";
    res.render("menu", {
        username,
        success: req.flash("success"),
    });
});

// // GET home page (login form)
// router.get("/", (req, res) => { 
//     res.render("login", { title: "Login" }); 
// }); 

// // POST login logic
// router.post("/login", (req, res) => {
//     const { username, password } = req.body;
    
//     // Placeholder login logic
//     if (username === "admin" && password === "admin") {
//         res.redirect("/home");  // Redirect to /home if login is successful
//     } else {
//         res.send("Invalid credentials");
//     }
// });

// // GET signup page
// router.get("/signup", (req, res) => {
//     res.render("signup", { title: "Signup" });
// });

// // POST signup handler (optional for now)
// router.post("/signup", (req, res) => {
//     // Save user logic would go here
//     res.send("User signed up!");
// });

// // GET home page after login
// router.get("/home", (req, res) => {
//     res.render("home", { title: "Home" });
// });

module.exports = router;