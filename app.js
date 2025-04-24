const express = require('express');
const path = require('path'); // Add this line
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const User = require("./db/models/user");

app.use(methodOverride("_method"));

// Connect to MongoDB
const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/Login-tut');
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Error connecting to DB:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public' directory (create this directory if it doesn't exist)
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

app.use(flash());

// User authentication middleware
app.use(async (req, res, next) => {
  if (req.session.user_id) {
    const user = await User.findById(req.session.user_id);
    res.locals.user = user;
    req.user = user;
  } else {
    res.locals.user = null;
  }
  next();
});

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", indexRouter);

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));