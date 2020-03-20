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

const Queue = require('bull');
const { buildRepoHistory } = require('./lib/tasks');

var githubTaskQueue = new Queue(
  'github-queue',
  {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD
    }
  }
);

githubTaskQueue.process(async (job) => {
  console.log(`Processing Job ${job.id}`);
  const { repoId, repoName, repoOwner, githubInstallationId } = job.data;
  await buildRepoHistory(repoId, repoOwner, repoName, githubInstallationId);
});

githubTaskQueue.isReady().then(() => {
  console.log('Worker ready to take jobs');
});

githubTaskQueue.on('failed', (job, e) => {
  console.error(`Failed Job ${job.id}: ${e}`);
});
