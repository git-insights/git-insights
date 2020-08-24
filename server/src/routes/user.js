const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();
const { withAuthentication } = require('../middlewares');

// All the routes need authorization
router.use(withAuthentication);

// Return users github repos
router.route('/github-repos').get(userController.getGithubRepos);
router.route('/github-repos/all').get(userController.getGithubReposAll);

// Pick a repo to track for user
router.route('/track-repo').post(userController.postTrackRepo);
router.route('/repositories').get(userController.getRepoStatus);
router.route('/repositories').post(userController.postRepositories);

// Logout
router.route('/logout').get(
  userController.getLogout
);

module.exports = router;
