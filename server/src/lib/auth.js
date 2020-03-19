const asyncHandler = require('express-async-handler');
const User = require('../../models').User;

exports.deserializeUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.user.id }
  });
  req.user = user;
  next();
});
