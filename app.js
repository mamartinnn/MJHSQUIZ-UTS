const express = require('express'); 
  const app = express(); 
  const methodOverride = require("method-override");
  const session = require("express-session"); 
  const flash = require("connect-flash");     
  const indexRouter = require("./routes/index");
  const mongoose = require("mongoose");
  const User = require("./db/models/user"); 
  app.use(methodOverride("_method"));
  const main = async () => {
    await mongoose.connect('mongodb://localhost:27017/Login-tut')
  };
  

  main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("err"));

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

  app.use(async (req, res, next) => {
    if (req.session.user_id) {
      const user = await User.findById(req.session.user_id);
      res.locals.user = user; // Make the user available in all views
      req.user = user;
    } else {
      res.locals.user = null; // No user logged in
    }
    next();
  });

  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
  });

  app.use("/", indexRouter);

  // Start the server
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));