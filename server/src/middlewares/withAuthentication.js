const withAuthentication = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

module.exports = withAuthentication;