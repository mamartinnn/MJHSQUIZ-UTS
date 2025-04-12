const express =  require("express");  
const router = express.Router();

router.get("/", (req, res) => { 
    res.render("home", { title: "Home" }); 
}); 

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Placeholder login logic
    if (username === "admin" && password === "admin") {
        res.send("Login successful!");
    } else {
        res.send("Invalid credentials");
    }
});

module.exports = router;