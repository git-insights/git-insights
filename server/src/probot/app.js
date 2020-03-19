// const setupApi = require('./api');
const models = require('../../models');
const Github = require('../../workers/lib/github');

// Returns true if repo is tracked, false otherwise
async function isRepoTracked(repoId) {
  const isTracked = await models.TrackedRepo.findOne({
    where: {
      repoId
    }
  });

  return isTracked;
}

module.exports = app => {
  /**
   * List of all available webhooks:
   * https://github.com/octokit/webhooks.js/blob/master/lib/webhook-names.json
   *
   * DEPRECATED EVENTS: integration_installation, integration_installation_repositories
   *
   */

  /**
   * REVIEW PAYLOADS
   *
   * Checkout test/fixtures/pull_request.[action.]json for sample payloads!
   */

  /**
   * Create a new code review
   */
  app.on('pull_request.opened', async context => {
    const payloadPR = context.payload.pull_request;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    await models.Review.create({
      id: payloadPR.id,
      repoId: payloadRepo.id,
      number: payloadPR.number,
      title: payloadPR.title,
      userGithubId: payloadSender.id,
      userGithubLogin: payloadSender.login,
      state: payloadPR.state,
      comments: payloadPR.comments,
      createdAt: payloadPR.created_at,
      updatedAt: payloadPR.updated_at,
      closedAt: payloadPR.closed_at,
      authorAssociation: payloadPR.author_association,
      body: payloadPR.body,
    });
  });

  /**
   * Create an issue event and update parent issue
   */
  app.on([
    'pull_request.closed',
    'pull_request.reopened',
    'pull_request.labeled',
    'pull_request.unlabeled',
    'pull_request.assigned',
    'pull_request.unassigned',
    'pull_request.ready_for_review',
    'pull_request.review_requested',
    'pull_request.review_request_removed',
  ], async context => {
    const payloadPR = context.payload.pull_request;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    await models.Review.update(
      {
        state: payloadPR.state,
        updatedAt: payloadPR.updated_at,
        closedAt: payloadPR.closed_at,
      }, {
        where: { id: payloadPR.id }
      }
    );

    await models.ReviewEvent.create({
      action: context.payload.action,
      issueId: payloadPR.id,
      repoId: payloadRepo.id,
      authorGithubId: payloadSender.id,
      authorGithubLogin: payloadSender.login,
      isBot: payloadSender.is_bot,
      createdAt: payloadPR.closedAt
    });
  });

  /**
   * Occurs when someone submits/edits a code review
   */
  app.on([
    'pull_request_review.dismissed',
    'pull_request_review.edited',
    'pull_request_review.submitted',
  ], async context => {
    const payloadReview = context.payload.pull_request;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;
    let action = '';

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    switch (context.payload.action) {
      case 'created':
        action = 'review-submitted';
        break;
      case 'edited':
        action = 'review-edited';
        break;
      case 'dismissed':
        action = 'review-deleted';
        break;
      default:
        throw Error(`Unexpected payload action: pull_request_review.${payload.action}`)
    }

    await models.ReviewEvent.create({
      action: action,
      reviewId: payloadReview.id,
      repoId: payloadRepo.id,
      authorGithubId: payloadSender.id,
      authorGithubLogin: payloadSender.login,
      isBot: payloadSender.is_bot,
      createdAt: payloadReview.created_at
    });
  });

  /**
   * Occurs when someone comments/edits on a code review
   */
  app.on([
    'pull_request_review_comment.created',
    'pull_request_review_comment.deleted',
    'pull_request_review_comment.edited',
  ], async context => {
    const payloadReview = context.payload.pull_request;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;
    let action = '';

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    switch (context.payload.action) {
      case 'created':
        action = 'review-comment-created';
        break;
      case 'edited':
        action = 'review-comment-edited';
        break;
      case 'deleted':
        action = 'review-comment-deleted';
        break;
      default:
        throw Error(`Unexpected payload action: pull_request_review_comment.${payload.action}`)
    }

    await models.Review.update(
      {
        updatedAt: payloadReview.updated_at,
        closedAt: payloadReview.closed_at,
      }, {
        where: { id: payloadReview.id }
      }
    );

    // TODO: decide if we want to track review issue comments or review comments, or both?

    await models.ReviewEvent.create({
      action: action,
      reviewId: payloadReview.id,
      repoId: payloadRepo.id,
      authorGithubId: payloadSender.id,
      authorGithubLogin: payloadSender.login,
      isBot: payloadSender.is_bot,
      createdAt: payloadReview.created_at
    });
  });

  /**
   * ISSUE PAYLOADS
   *
   * Checkout test/fixtures/issues.[action.]json for sample payloads!
   */

  /**
   * Create a new issue
   */
  app.on('issues.opened', async context => {
    const payloadIssue = context.payload.issue;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    await models.Issue.create({
      id: payloadIssue.id,
      repoId: payloadRepo.id,
      number: payloadIssue.number,
      title: payloadIssue.title,
      userGithubId: payloadSender.id,
      userGithubLogin: payloadSender.login,
      state: payloadIssue.state,
      comments: payloadIssue.comments,
      createdAt: payloadIssue.created_at,
      updatedAt: payloadIssue.updated_at,
      closedAt: payloadIssue.closed_at,
      authorAssociation: payloadIssue.author_association,
      body: payloadIssue.body,
    });
  });

  /**
   * Create an issue event and update parent issue
   */
  app.on([
    'issues.closed',
    'issues.reopened',
    'issues.labeled',
    'issues.unlabeled',
    'issues.assigned',
    'issues.unassigned',
  ], async context => {
    const payloadIssue = context.payload.issue;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    await models.Issue.update(
      {
        state: payloadIssue.state,
        updatedAt: payloadIssue.updated_at,
        closedAt: payloadIssue.closed_at,
      }, {
        where: { id: payloadIssue.id }
      }
    );

    await models.IssueEvent.create({
      action: context.payload.action,
      issueId: payloadIssue.id,
      repoId: payloadRepo.id,
      authorGithubId: payloadSender.id,
      authorGithubLogin: payloadSender.login,
      isBot: payloadSender.is_bot,
      createdAt: payloadIssue.created_at
    });
  });

  /**
   * On issue deletion, we should delete the records as well
   * Since deleting is not a very common event, we're not counting it as an activity
   */
  app.on('issues.deleted', async context => {
    const payloadIssue = context.payload.issue;
    const payloadRepo = context.payload.repository;

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    await models.IssueEvent.destroy({
      where: {
        issueId: payloadIssue.id
      }
    });

    await models.Issue.destroy({ where: { id: payloadIssue.id } });
  });

  /**
   * PUSH EVENT
   */
  app.on([
    'push'
  ], async context => {
    const repoId = context.payload.repository.id;

    // if it's not a push on master, ignore it
    if (context.payload.ref !== 'refs/heads/master') return

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(repoId);
    if (!isTracked) return;

    // No commit info
    if (context.payload.commits.length === 0) return;

    /**
     * TODO: Check if there's a more efficient way to do this
     */
    let allCommits = [];

    const options = {
      'user-agent': 'gazer',
      type: 'app-installation',
      applicationId: process.env.GH_APP_ID,
      installationId: context.payload.installation.id,
      privateKey: process.env.GH_APP_PRIVATE_KEY,
      // log: console
    };
    const github = new Github(options);

    for (commit of context.payload.commits) {
      let commitDetail = await github.getCommitFromRepo(
        context.payload.repository.owner.name,
        context.payload.repository.name,
        commit.id
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
  });

  /**
   * SHARED EVENTS: Comments
   * Issue level comments are shared between 'issues' and 'pull_requests'
   * on Github. If it belongs to a PR, it will have pull_request field attached
   */
  app.on([
    'issue_comment.created',
    'issue_comment.deleted',
    'issue_comment.edited',
  ], async context => {
    const payloadIssue = context.payload.issue;
    const payloadRepo = context.payload.repository;
    const payloadSender = context.payload.sender;
    const payloadInstallation = context.payload.installation;
    let action = '';

    // Check if this repo is being tracked, otherwise don't store the data
    const isTracked = await isRepoTracked(payloadRepo.id);
    if (!isTracked) return;

    switch (context.payload.action) {
      case 'created':
        action = 'comment-created';
        break;
      case 'edited':
        action = 'comment-edited';
        break;
      case 'deleted':
        action = 'comment-deleted';
        break;
      default:
        throw Error(`Unexpected payload action: issue_comment.${payload.action}`)
    }

    await models.Issue.update(
      {
        state: payloadIssue.state,
        updatedAt: payloadIssue.updated_at,
        closedAt: payloadIssue.closed_at,
      }, {
        where: { id: payloadIssue.id }
      }
    );

    if (action === 'comment-created') {
      await models.Issue.increment('comments', {
        by: 1,
        where: {
          id: payloadIssue.id
        }
      });
    } else if (action === 'comment-deleted') {
      await models.Issue.decrement('comments', {
        by: 1,
        where: {
          id: payloadIssue.id
        }
      });
    }

    await models.IssueEvent.create({
      action: action,
      issueId: payloadIssue.id,
      repoId: payloadRepo.id,
      authorGithubId: payloadSender.id,
      authorGithubLogin: payloadSender.login,
      isBot: payloadSender.is_bot,
      createdAt: payloadIssue.created_at
    });
  });

  /**
   * GENERAL REPO RELATED EVENTS
   */

  /**
   * TODO: The app is installed first time, potentially on 1+ repos
   */
  app.on('installation.created', async context => {});

  /**
   * TODO: Means the app is deleted from the account
   */
  app.on('installation.deleted', async context => {});

  /**
   * TODO: Repository added or removed from installation
   */
  app.on('installation_repositories.added', async context => {});
  app.on('installation_repositories.removed', async context => {});

  /**
   * TODO: HANDLE THE FOLLOWING EVENTS

   * "issues.demilestoned",
   * "issues.edited",
   * "issues.locked",
   * "issues.milestoned",
   * "issues.pinned",
   * "issues.transferred",
   * "issues.unlocked",
   * "issues.unpinned",

   * "pull_request.edited",
   * "pull_request.locked",
   * "pull_request.synchronize",
   * "pull_request.unlocked",
   */
};