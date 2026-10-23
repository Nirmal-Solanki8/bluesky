// Protect admin routes
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  req.flash('error_msg', 'Please login to access the admin panel.');
  res.redirect('/admin/login');
};

// Redirect authenticated admin
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  next();
};
