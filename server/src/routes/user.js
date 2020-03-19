const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();
const { withAuthentication } = require('../middlewares');

// All the routes need authorization
router.use(withAuthentication);

// Return users github repos, paginated
router.route('/github-repos').get(
  userController.getGithubRepos
);

// Pick a repo to track for user
router.route('/track-repo').post(
  userController.postTrackRepo
);

// Logout
router.route('/logout').get(
  userController.getLogout
);

module.exports = router;
