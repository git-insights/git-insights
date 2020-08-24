const asyncHandler = require('express-async-handler');
const models = require('../../models');

/**
 *  GET /account
 */
exports.getUser = asyncHandler(async (req, res) => {
  /**
   * Return user and information about it's tracked repos
   */
  if (!req.user) return res.json({ user: null });
  const attributes = [
    'id',
    'name',
    'full_name',
    'description',
    'url',
    'processed'
  ];

  const userId = req.user.id;

  const user = await models.User.findOne({
    where: { id: userId },
    include: {
      model: models.Repo,
      as: 'repos',
      attributes
    }
  });

  res.json({ user });
});