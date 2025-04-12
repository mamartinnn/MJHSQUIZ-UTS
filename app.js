const express = require('express'); 
const app = express(); 
const methodOverride = require("method-override");
const session = require("express-session"); 
const flash = require("connect-flash");     
const indexRouter = require("./routes/index");

require("dotenv").config(); 


app.use(express.urlencoded({ extended: true })); 
app.use(express.json());


app.set("view engine", "ejs");


app.use(session({
  secret: "supersecretkey", // or use process.env.ACCESS_TOKEN_SECRET
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));


app.use(flash());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
