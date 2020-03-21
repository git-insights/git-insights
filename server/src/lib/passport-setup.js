const passport = require('passport');
const { Strategy: GitHubStrategy } = require('./passport-github');
const User = require('../../models').User;

// TODO: figure out how to display errors nicely

// Passport session setup.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (userId, done) => {
  try {
    // TODO: only hold public values
    const dbUser = await User.findOne({ where: { id: userId }});
    done(null, dbUser);
  } catch (err) {
    done(err, userId);
  }
});

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
  clientID: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({
      where: { githubId: profile.githubId }
    });

    // If user already exists, just return the user
    if (existingUser) {
      return done(null, existingUser);
    }

    const existingEmailUser = await User.findOne({ where: { email: profile.email } });

    // This will become more meaningful as we have multiple social logins
    // but an error for now
    if (existingEmailUser) {
      // TODO: flash won't work here, fix error handling
      const errMsg = 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.';
      req.flash('errors', { msg: errMsg });
      throw(new Error(errMsg));
    } else {
      const user = User.build({ ...profile });
      user.githubToken = accessToken;
      const savedUser = await user.save();
      return done(null, savedUser);
    }
  } catch (err) {
    // TODO: fix error handling
    // console.log(err);
    return done(err);
  }
}));
