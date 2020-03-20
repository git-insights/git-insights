#!/usr/bin/env node
const fs = require('fs');
const NODE_ENV = process.env.NODE_ENV || 'development';

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${__dirname}/../.env.${NODE_ENV}.local`,
  `${__dirname}/../.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${__dirname}/../.env.local`,
  `${__dirname}/../.env`,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

/**
 * Set Up Logger
 */
const logger = require('./lib/logger');

/**
 * If dev mode, start smee for webhook reverse-proxy
 */
if (NODE_ENV === 'development') {
  try {
    const SmeeClient = require('smee-client');
    const smee = new SmeeClient({
      logger: logger,
      source: process.env.GH_APP_WEBHOOK_PROXY_URL,
      target: `http://localhost:${process.env.PORT}/hooks/github`
    });
    smee.start();
  } catch (err) {
    logger.error('smee failed to start');
  }
}

/**
 * Connect to Redis
 */
const { Connection } = require('./lib/queues');
Connection.connectToRedis();

/**
 * Load the app and start it
 */
const app = require('.');

const server = app.listen(process.env.PORT, () => {
  const port = server.address().port;
  logger.info(`Server listening on port ${port}`);
});
