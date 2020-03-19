const asyncHandler = require('express-async-handler');

/**
 *  GET /account
 */
exports.getUser = asyncHandler(async (req, res) => {
  res.json({ user: req.user || null });
});