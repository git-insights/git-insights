const express = require("express");

/**
 *  3rd party dependencies
 */
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('cookie-session');
const passport = require('passport');
const errorhandler = require('errorhandler');
const Sentry = require('@sentry/node');

/**
 *  Important constants
 */
const corsOptions = {
  origin: process.env.URL_APP,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  // exposedHeaders: ['x-auth-token']
};

/**
 *  Initiate database connection
 */
const db = require('../../models');

// db.sequelize.sync({force: true});

const app = express();

/**
 * Setup Sentry and add the middleware
 */
if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: process.env.SENTRY_DSN });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
}

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use(session({
  keys: [process.env.SESSION_SECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  // FIXME: bug in superagent/cookiejar that prevents it from saving this
  signed: process.env.NODE_ENV !== 'test',
  httpOnly: true,
}));

// TODO: check if we can use these in prod only
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}

/**
 *  SETUP AUTH
 */
require('../lib/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

/**
 *  ROUTES
 */
const routes = require('../routes');
app.use('/', routes);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

if (process.env.NODE_ENV === 'development') {
  // dev only error handler
  app.use(errorhandler())
} else {
  app.use(Sentry.Handlers.errorHandler());
}

// Basic error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send('Invalid token');
  }
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

module.exports = app;
