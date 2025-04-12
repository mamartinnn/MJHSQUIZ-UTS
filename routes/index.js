const express = require("express");  
const router = express.Router();

// GET home page (login form)
router.get("/", (req, res) => { 
    res.render("login", { title: "Login" }); 
}); 

// POST login logic
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Placeholder login logic
    if (username === "admin" && password === "admin") {
        res.redirect("/home");  // Redirect to /home if login is successful
    } else {
        res.send("Invalid credentials");
    }
});

// GET signup page
router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup" });
});

// POST signup handler (optional for now)
router.post("/signup", (req, res) => {
    // Save user logic would go here
    res.send("User signed up!");
});

// GET home page after login
router.get("/home", (req, res) => {
    res.render("home", { title: "Home" });
});

module.exports = router;