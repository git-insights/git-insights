const bgTasks = require('../lib/background');
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

// First task
router.route('/repo-stats-update').get(asyncHandler(async(req, res) => {
  await bgTasks.createTask('/update-tracked-repo-stats');
  return res.status(200).send();
}));

module.exports = router;
