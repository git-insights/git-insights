const accountController = require('../controllers/account');
const express = require('express');
const router = express.Router();

// Fetch stargazers
router.route('/').get(
  accountController.getUser
);

module.exports = router;
