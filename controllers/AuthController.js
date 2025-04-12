// const bcrypt = require("bcrypt");
// const User = require("../db/models/user");
// const { userValidationSchema } = require("../validation/userValidationSchema");

// const AuthController = {
//   getSignUp: (req, res) => {
//     res.render("signup");
//   },

//   postSignUp: async (req, res, next) => {
//     const { username, email, password, passwordRepeat } = req.body;

//     const { error } = userValidationSchema.validate({
//       username,
//       email,
//       password,
//       passwordRepeat,
//     });

//     if (error) {
//       const messages = error.details.map((detail) => detail.message).join(", ");
//       req.flash("error", messages);
//       return res.redirect(302, "/signup");
//     }

    
//     let foundUser;
//     try {
//     //   foundUser = await User.find({ username });
//       console.log(foundUser);
//     } catch (err) {
//       req.flash("error", err.message);
//       return res.redirect(302, "/signup");
//     }

//     if (foundUser && foundUser.length > 0) {
//       console.log("in foundUser", foundUser);
//       req.flash("error", "Username already exists!");
//       return res.redirect(302, "/signup");
//     }

//     const saltRounds = 10;
//     const hash = await bcrypt.hash(password, saltRounds);
//     const newUser = {
//       username,
//       password: hash,
//       scores: [],
//     };

//     let user;
//     try {
//       user = await User.create(newUser);
//     } catch (err) {
//       req.flash("error", err);
//       return res.redirect(302, "/signup");
//     }

//     if (user) {
//       req.session.user_id = user._id;
//       req.flash(
//         "success",
//         "Your account has been created"
//       );
//       return res.redirect(302, "/");
//     } else {
//       req.flash("error", "Unknown error, please try later again!");
//       return res.redirect(302, "/signup");
//     }
//   },

//   getLogin: (req, res) => {
//     res.render("login");
//   },

//   postLogin: async (req, res, next) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       req.flash("error", "Username or password can not be empty!");
//       return res.redirect(302, "/");
//     }

//     let foundUser;
//     try {
//       foundUser = await User.findOne({ username });
//     } catch (err) {
//       req.flash("error", err);
//       return res.redirect(302, "/");
//     }

//     if (!foundUser) {
//       req.flash("error", "Incorrect username or password!");
//       return res.redirect(302, "/");
//     }

//     const confirmPassword = await bcrypt.compare(password, foundUser.password);
//     if (!confirmPassword) {
//       req.flash("error", "Incorrect username or password!");
//       return res.redirect(302, "/");
//     }
//     req.session.user_id = foundUser._id;
//     req.flash("success", `Welcome ${foundUser.username}!`);
//     const redirectUrl = res.locals.returnTo || "/menu";
//     res.redirect(302, redirectUrl);
//   },

//   logout: (req, res) => {
//     req.session.user_id = null;
//     req.flash("success", "Successfully logged out");
//     res.redirect("/");
//   },
// };

// module.exports = AuthController;

// controllers/AuthController.js

const bcrypt = require("bcrypt");
const { userValidationSchema } = require("../validation/userValidationSchema");

const mockUsers = [
  {
    id: 1,
    username: "testuser",
    password: "$2b$10$xqg9R/T9Nh9ZJX1W9vJz0.4FT8G1hNDZ6oeH2YUGn9DwYcId.J6Ca", // 'password123'
  },
];

let userIdCounter = 2;

const AuthController = {
  getSignUp: (req, res) => {
    res.render("signup");
  },

  postSignUp: async (req, res) => {
    const { username, password, passwordRepeat } = req.body;

    const { error } = userValidationSchema.validate({
      username,
      password,
      passwordRepeat,
    });

    if (error) {
      req.flash("error", "Validation error: " + error.details[0].message);
      return res.redirect("/signup");
    }

    const existingUser = mockUsers.find((user) => user.username === username);
    if (existingUser) {
      req.flash("error", "Username already taken.");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: userIdCounter++,
      username,
      password: hashedPassword,
    };
    mockUsers.push(newUser);
    req.session.user_id = newUser.id;
    req.flash("success", "Account created. Welcome!");
    res.redirect("/");
  },

  getLogin: (req, res) => {
    res.render("login");
  },

  postLogin: async (req, res) => {
    const { username, password } = req.body;

    const user = mockUsers.find((u) => u.username === username);
    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/");
    }

    req.session.user_id = user.id;
    // req.session.user_id = foundUser._id;
    req.flash("success", `Welcome ${user.username}!`);
    const redirectUrl = res.locals.returnTo || "/menu";
    res.redirect(302, redirectUrl);

  },

  logout: (req, res) => {
    req.session.user_id = null;
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  },
};

module.exports = AuthController;
