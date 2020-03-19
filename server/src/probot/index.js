const { createProbot } = require('probot');
const app = require('./app');

/**
 * Probot comes bundled with Sentry. It's set by SENTRY_DSN env var
 * https://probot.github.io/docs/deployment/#error-tracking
 */

const probot = createProbot({
  id: process.env.GH_APP_ID,
  secret: process.env.GH_APP_WEBHOOK_SECRET,
  cert: process.env.GH_APP_PRIVATE_KEY,
});

probot.load(app);

module.exports = probot.server;