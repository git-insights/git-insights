const authController = require('../controllers/auth');
const express = require('express');
const passport = require('passport');
const { generateToken, sendToken } = require('../lib/tokens');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.route('/github').get(
  (req, res, next) => {
    if (req.query && req.query.next && req.query.next.startsWith('/')) {
      req.session.next_url = req.query.next;
    } else {
      req.session.next_url = null;
    }

    passport.authenticate('github')(req, res, next);
  }
);

router.route('/github/callback').get(
  passport.authenticate('github', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    let redirectUrlAfterLogin;

    if (req.user && req.session.next_url) {
      redirectUrlAfterLogin = req.session.next_url;
    } else if (req.user && !req.user.trackingRepo) {
      redirectUrlAfterLogin = '/setup/code-repository';
    } else {
      redirectUrlAfterLogin = '/';
    }

    res.redirect(`${process.env.URL_APP}${redirectUrlAfterLogin}`);
  }
);

/**
 * Depending on user status redirect
 */
router.route('/github-app/connect').get(
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.redirect(`${process.env.URL_APP}`);
    } else {
      if (req.user.githubAppId) {
        res.redirect(`${process.env.URL_APP}/setup/code-repository/github`);
      } else {
        res.redirect(`${process.env.GH_APP_INSTALL_URL}`);
      }
    }
  })
)

/**
 * Save github installation id and redirect to github setup
 */
router.route('/github-app/callback').get(
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.redirect(`${process.env.URL_APP}`);
    } else {
      req.user.githubAppId = req.query.installation_id;
      await req.user.save();
      res.redirect(`${process.env.URL_APP}/setup/code-repository/github`);
    }
  })
);

router.route('/login/success').get(authController.getLoginSuccess);
router.route('/login/failed').get(authController.getLoginFailure);
router.route('/login/logout').get(authController.getLogout);


module.exports = router;
