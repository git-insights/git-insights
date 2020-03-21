const asyncHandler = require('express-async-handler');

/**
 *  GET /auth/login/success
 */
exports.getLoginSuccess = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

/**
 *  GET /auth/login/failure
 */
exports.getLoginFailure = asyncHandler(async (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

/**
 *  GET /auth/logout
 */
exports.getLogout = asyncHandler(async (req, res) => {
  req.logout();
  // TODO: fix constant val
  // res.redirect(CLIENT_HOME_PAGE_URL);
  res.redirect('http://www.google.com');
});

exports.postGithubAuthenticate = function(req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };

  next();
}