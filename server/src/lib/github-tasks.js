const Github = require('./github');
const models = require('../../models');
const { daysAgo } = require('./times');
const moment = require('moment-timezone');
const { Op } = require('sequelize');
const createQueue = require('./queues');
const logger = require('./logger');
moment.tz.setDefault('America/Los_Angeles');

const GH_APP_PRIVATE_KEY = JSON.parse(`"${process.env.GH_APP_PRIVATE_KEY}"`);

async function buildRepoHistory(repoId, repoOwner, repoName, githubInstallationId) {
  // Process everything
  await fetchAndSaveIssues(repoId, repoOwner, repoName, githubInstallationId);
  await fetchAndSavePullRequests(repoId, repoOwner, repoName, githubInstallationId);
  await fetchAndSaveCommits(repoId, repoOwner, repoName, githubInstallationId);
  await fetchAndSaveGithubUsers(repoId, githubInstallationId);
  // Finally save the repo
  await models.Repo.update(
    { processed: true },
    { where: { id: repoId } }
  );
}

async function fetchAndSaveIssues(repoId, owner, repo, githubInstallationId) {
  const options = {
    'user-agent': 'gazer',
    type: 'app-installation',
    installationId: githubInstallationId,
    applicationId: process.env.GH_APP_ID,
    privateKey: GH_APP_PRIVATE_KEY,
    // log: console
  };
  const github = new Github(options);

  let issues = await github.listIssuesFromRepo(
    owner,
    repo,
    daysAgo(30),
    "all",
  );

  // Map from Github to our DB
  issues = issues.map(issue => ({
    id: issue.id,
    repoId: repoId,
    number: issue.number,
    title: issue.title,
    userGithubId: issue.user.id,
    userGithubLogin: issue.user.login,
    state: issue.state,
    comments: issue.comments,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,
    authorAssociation: issue.author_association,
    body: issue.body,
  }));

  // Bulk create Issues
  await models.Issue.bulkCreate(issues);

  let allEvents = [];

  for (const issue of issues) {
    let events = await github.listIssueEvents(
      owner,
      repo,
      issue.number
    );

    events = events.map(event => ({
      action: event.event,
      issueId: issue.id,
      repoId: repoId,
      authorGithubId: event.actor.id,
      authorGithubLogin: event.actor.login,
      isBot: event.actor.type === 'Bot',
      createdAt: event.created_at,
    }));

    allEvents.push(...events);
  }

  // Bulk create issue-events
  await models.IssueEvent.bulkCreate(allEvents);
}

async function fetchAndSaveCommits(repoId, owner, repo, githubInstallationId) {
  const options = {
    'user-agent': 'gazer',
    type: 'app-installation',
    installationId: githubInstallationId,
    applicationId: process.env.GH_APP_ID,
    privateKey: GH_APP_PRIVATE_KEY,
    // log: console
  };
  const github = new Github(options);

  let commits = await github.listCommitsFromRepo(
    owner,
    repo,
    daysAgo(30)
  );

  let allCommits = []

  for (const commit of commits) {
    let commitDetail = await github.getCommitFromRepo(
      owner,
      repo,
      commit.sha
    );

    allCommits.push(commitDetail);
  }

  allCommits = allCommits.map(commit => ({
    repoId: repoId,
    sha: commit.sha,
    authorName: commit.commit.author.name,
    authorEmail: commit.commit.author.email,
    authorDate: commit.commit.author.date,
    committerName: commit.commit.committer.name,
    committerEmail: commit.commit.committer.email,
    committerDate: commit.commit.committer.date,
    message: commit.commit.message,
    lineAdditions: commit.stats.additions,
    lineDeletions: commit.stats.deletions,
    lineTotalChanges: commit.stats.total,
  }))

  // Bulk create commits
  await models.Commit.bulkCreate(allCommits);
}

async function fetchAndSavePullRequests(repoId, owner, repo, githubInstallationId) {
  const options = {
    'user-agent': 'gazer',
    type: 'app-installation',
    installationId: githubInstallationId,
    applicationId: process.env.GH_APP_ID,
    privateKey: GH_APP_PRIVATE_KEY,
    // log: console
  };
  const github = new Github(options);
  let reviews = await github.listPullRequestsFromRepo(
    owner,
    repo,
    daysAgo(30),
    "all",
  );

  // Map from Github to our DB
  reviews = reviews.map(review => ({
    id: review.id,
    repoId: repoId,
    number: review.number,
    title: review.title,
    userGithubId: review.user.id,
    userGithubLogin: review.user.login,
    state: review.state,
    comments: review.comments,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
    closedAt: review.closed_at,
    authorAssociation: review.author_association,
    body: review.body,
  }));

  // Bulk create reviews
  await models.Review.bulkCreate(reviews);

  const allEvents = [];

  for (const review of reviews) {
    let events = await github.listPullRequestEvents(
      owner,
      repo,
      review.number
    );

    events = events.map(event => {
      if (event.event === 'committed') {
        return {
          action: 'committed',
          reviewId: review.id,
          repoId: repoId,
          authorName: event.author.name,
          authorEmail: event.author.email,
          isBot: false,
          createdAt: event.author.date,
        }
      } else if (event.event === 'reviewed') {
        let actionName = '';
        switch (event.state) {
          case 'commented':
            actionName = 'review-commented';
            break;
          case 'approved':
            actionName = 'review-approved';
            break;
          case 'changes_requested':
            actionName = 'review-changes_requested';
            break;
          default:
            throw Error(`unexpected event case: ${event.state}`);
        }
        return {
          action: actionName,
          reviewId: review.id,
          repoId: repoId,
          authorGithubId: event.user.id,
          authorGithubLogin: event.user.login,
          isBot: event.user.type === 'Bot',
          createdAt: event.submitted_at
        }
      } else {
        return {
          action: event.event,
          reviewId: review.id,
          repoId: repoId,
          authorGithubId: event.actor.id,
          authorGithubLogin: event.actor.login,
          isBot: event.actor.type === 'Bot',
          createdAt: event.created_at
        }
      }
    });

    allEvents.push(...events);
  }

  await models.ReviewEvent.bulkCreate(allEvents);
}

/**
 * TODO: check if some users exist before querying github api
 */
async function fetchAndSaveGithubUsers(repoId, githubInstallationId) {
  const options = {
    'user-agent': 'gazer',
    type: 'app-installation',
    installationId: githubInstallationId,
    applicationId: process.env.GH_APP_ID,
    privateKey: GH_APP_PRIVATE_KEY,
    // log: console
  };
  const github = new Github(options);
  const uniqueGithubLogins = new Set();

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
    },
    attributes: ['user_github_login', 'userGithubLogin'],
    group: ['user_github_login']
  });

  // Issue Events
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
    },
    attributes: ['author_github_login', 'authorGithubLogin'],
    group: ['author_github_login']
  });

  // Reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
    },
    attributes: ['user_github_login', 'userGithubLogin'],
    group: ['user_github_login']
  });

  // Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      author_github_login: {
        [Op.ne]: null,
      }
    },
    attributes: ['author_github_login', 'authorGithubLogin'],
    group: ['author_github_login']
  });

  issues.forEach(issue => uniqueGithubLogins.add(issue.userGithubLogin));
  reviews.forEach(review => uniqueGithubLogins.add(review.userGithubLogin));
  issueEvents.forEach(event => uniqueGithubLogins.add(event.authorGithubLogin));
  reviewEvents.forEach(event => uniqueGithubLogins.add(event.authorGithubLogin));

  const users = [];

  for (let githubLogin of uniqueGithubLogins) {
    let user = await github.getUser(githubLogin);
    users.push(user);
  }

  await models.GithubUser.bulkCreate(users, {
    updateOnDuplicate: Object.keys(models.GithubUser.prototype.rawAttributes)
  });
}

const githubTaskQueue = createQueue('github tasks');

githubTaskQueue.process(async job => {
  try {
    logger.info(`Processing Job ${job.id}`);
    const { repoId, repoName, repoOwner, githubInstallationId } = job.data;
    await buildRepoHistory(repoId, repoOwner, repoName, githubInstallationId);
  } catch (err) {
    logger.error(err);
  }
});

const parseGithubHistory = (repoId, repoOwner, repoName, githubInstallationId) => {
  return githubTaskQueue.add(
    {
      repoId,
      repoOwner,
      repoName,
      githubInstallationId,
    },
    {
      attempts: 5,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 60 * 1000,
      },
    }
  );
};

module.exports = {
  parseGithubHistory,
}
