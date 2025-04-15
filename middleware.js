const User = require("./db/models/user");
module.exports.authenticateUser = (req, res, next) => {
    if (req.session.user_id) {
      return next();
    }

    if (req.originalUrl !== "/logout") {
      req.session.returnTo = req.originalUrl;
    }
    req.flash('error', 'You have to logged in to see the page!')
    res.redirect(302, "/");
  };
  
  
  module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
  }

  module.exports.isAdmin = async (req, res, next) => {
    try {
      // Ensure the user is authenticated
      if (!req.session.user_id) {
        req.flash("error", "You must be logged in!");
        return res.redirect(302, "/");
      }
  
      // Fetch the user from the database
      const user = await User.findById(req.session.user_id);
  
      if (!user) {
        req.flash("error", "User not found!");
        return res.redirect(302, "/");
      }
  
      // Check if the user is admin
      if (user.username === "admin") {
        return next(); // Allow access to the route
      }
  
      // If not admin, redirect to the default menu
      req.flash("error", "You do not have the required permissions!");
      return res.redirect(302, "/menu");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred!");
      res.redirect(302, "/");
    }
  };