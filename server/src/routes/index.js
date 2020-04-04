const express = require('express');
const repoRoutes = require('./repo');
const accountRoutes = require('./account');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const router = express.Router();

// Mount Routes
router.use('/accounts', accountRoutes);
router.use('/repo', repoRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

const models = require('../../models')
router.get('/test', async (req, res) => {
  const user = await models.User.findOne({
    where: {
      id: 1
    },
    include: [ 'Repos' ]
  });
  // const repos = await user.getRepos();
  return res.json(user)
})

module.exports = router;
