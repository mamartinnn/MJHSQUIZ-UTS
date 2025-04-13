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