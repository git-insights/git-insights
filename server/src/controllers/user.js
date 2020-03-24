const asyncHandler = require('express-async-handler');
const models = require('../../models');
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
  log: console
});
const queues = require('../lib/queues').Connection;
const logger = require('../lib/logger');

/**
 * TODO: for now we create a new token every time
 * we should save the token to user with expiration date
 */
async function getUserToken(user) {
  const { App } = require("@octokit/app");

  const installationId = user.githubAppId;

  const app = new App({ id: process.env.GH_APP_ID, privateKey: process.env.GH_APP_PRIVATE_KEY });
  const installationAccessToken = await app.getInstallationAccessToken({ installationId });

  return installationAccessToken;
}

/**
 *  GET /user/github-repos
 */
exports.getGithubRepos = asyncHandler(async (req, res) => {
  const user = req.user;
  const perPage = 12;
  let currentPage = req.query.currentPage || 1;

  // Get user token
  const installationAccessToken = await getUserToken(user);

  // TODO: need param validation for currentPage
  // In case current page is a string
  currentPage = parseInt(currentPage, 10);

  // TODO: Change error handling to be less robust?
  const fetch = async () => {
    try {
      let result = {};

      // TODO: handle ratelimit
      const response = await octokit.apps.listRepos({
        per_page: perPage,
        sort: 'updated',
        page: currentPage,
        headers: {
          accept: "application/vnd.github.machine-man-preview+json",
          authorization: `BEARER ${installationAccessToken}`
        }
      });

      // We parse headers link for prev & next if they exist
      // <https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=1>; rel=\"prev\",
      // <https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=3>; rel=\"next\",
      // <https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=8>; rel=\"last\",
      // <https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=1>; rel=\"first\"
      const prev = response.headers.link ? response.headers.link.match(/rel="prev/gm) : undefined;
      const next = response.headers.link ? response.headers.link.match(/rel="next/gm) : undefined;

      let prevPage = null;
      let nextPage = null;

      // Remove superfluous characters if prev / next exists
      if (prev) {
        prevPage = currentPage - 1;
      }
      if (next) {
        nextPage = currentPage + 1;
      }

      result = {
        prevPage,
        nextPage,
        currentPage,
        data: response.data.repositories
      }
      return result;
    } catch (err) {
      logger.error(err.message);
      return {};
    }
  }

  let result = await fetch();
  return res.status(200).json(result);
});

/**
 *  POST /user/track-repo
 */
exports.postTrackRepo = asyncHandler(async (req, res, _next) => {
  const user = req.user;

  // TODO: param validations
  const owner = req.body.owner;
  const repoName = req.body.repo;

  // if we're already tracking a repo, something is wrong
  if (user.trackingRepo) {
    throw Error('already tracking a repo');
  }

  // TODO: Add check to make sure user owns this repo
  let repoDetails;
  try {
    repoDetails = await octokit.repos.get({
      owner,
      repo: repoName,
      headers: {
        accept: "application/vnd.github.machine-man-preview+json",
        authorization: `BEARER ${user.githubToken}`
      }
    });
    repoDetails = repoDetails.data;
    repoDetails.processed = false;
    repoDetails.user_id = user.id;
  } catch (e) {
    throw Error('Something unexpected happened while fetching repo');
  }

  await models.Repo.upsert(repoDetails);
  await models.User.update({
    trackingRepo: true,
    primaryRepo: repoDetails.id
  }, {where: { id: user.id }});

  // Add task to queue
  const task = await queues.githubTaskQueue.add({
    repoId: repoDetails.id,
    repoOwner: owner,
    repoName: repoName,
    githubInstallationId: user.githubAppId
  });
  logger.info(`Created task ${task.id}`);

  return res.status(200).json({ repoId: repoDetails.id });
});

/**
 *  GET /user/logout
 */
exports.getLogout = asyncHandler(async (req, res, _next) => {
  req.logout();
  return res.status(200).json({ status: 'ok' })
});