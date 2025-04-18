const bcrypt = require("bcrypt");
const User = require("../db/models/user");
const { userValidationSchema } = require("../validation/userValidationSchema");

const AuthController = {
  getSignUp: (req, res) => {
    res.render("signup");
  },

  postSignUp: async (req, res, next) => {
    const { username, password, passwordRepeat } = req.body;

    const { error } = userValidationSchema.validate({
      username,
      password,
      passwordRepeat,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      req.flash("error", messages);
      return res.redirect(302, "/signup");
    }

    
    let foundUser;
    try {
      foundUser = await User.find({ username });
      console.log(foundUser);
    } catch (err) {
      req.flash("error", err.message);
      return res.redirect(302, "/signup");
    }

    if (foundUser && foundUser.length > 0) {
      console.log("in foundUser", foundUser);
      req.flash("error", "Username already exists!");
      return res.redirect(302, "/signup");
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = {
      username,
      password: hash,
      scores: [],
    };

    let user;
    try {
      user = await User.create(newUser);
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/signup");
    }

    if (user) {
      req.session.user_id = user._id;
      req.flash(
        "success",
        "Your account has been created"
      );
      return res.redirect(302, "/");
    } else {
      req.flash("error", "Unknown error, please try later again!");
      return res.redirect(302, "/signup");
    }
  },

  getLogin: (req, res) => {
    res.render("login");
  },

  postLogin: async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash("error", "Username or password can not be empty!");
      return res.redirect(302, "/");
    }

    let foundUser;
    try {
      foundUser = await User.findOne({ username });
    } catch (err) {
      req.flash("error", err);
      return res.redirect(302, "/");
    }

    if (!foundUser) {
      req.flash("error", "Incorrect username or password!");
      return res.redirect(302, "/");
    }

    const confirmPassword = await bcrypt.compare(password, foundUser.password);
    if (!confirmPassword) {
      req.flash("error", "Incorrect username or password!");
      return res.redirect(302, "/");
    }
    req.session.user_id = foundUser._id;
    res.locals.user = foundUser;
    req.flash("success", `Welcome ${foundUser.username}!`);
    const redirectUrl = res.locals.returnTo || "/menu";
    res.redirect(302, redirectUrl);
  },
  
  logout: (req, res) => {
    req.session.user_id = null;
    req.flash("success", "Successfully logged out");
    res.redirect("/");
  },
};

module.exports = AuthController;