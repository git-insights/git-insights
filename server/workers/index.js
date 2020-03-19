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

const {
  buildRepoHistory,
} = require('./lib/tasks');

const express = require('express');

const app = express();
app.enable('trust proxy');

// By default, the Content-Type header of the Task request is set to "application/octet-stream"
// see https://cloud.google.com/tasks/docs/reference/rest/v2beta3/projects.locations.queues.tasks#AppEngineHttpRequest
// app.use(bodyParser.raw({type: 'application/octet-stream'}));
app.use(express.json())

// Basic index to verify app is serving
app.get('/', (req, res) => { res.send('OK').end(); });

app.post('/log_payload', (req, res) => {
  // Log the request payload
  console.log('Received task with payload: %s', req.body);
  res.send(`Printed task payload: ${req.body}`).end();
});

app.post('/repo-history', async (req, res) => {
  const { repoId, repoName, repoOwner, githubInstallationId } = req.body;
  await buildRepoHistory(repoId, repoOwner, repoName, githubInstallationId);
  res.send('ok').end;
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
