const repoController = require('../controllers/repo');
const express = require('express');
const router = express.Router();
const { withAuthentication } = require('../middlewares');

// All the routes need authorization
router.use(withAuthentication);

/**
 * Dashboard Graphs
 */
router.route('/:id/activity-dates-times').get(repoController.getActivityDatesTimes);
router.route('/:id/time-to-first-response').get(repoController.getTimeToFirstResponse);
router.route('/:id/contributors').get(repoController.getContributors);
router.route('/:id/contributors/organizations').get(repoController.getContributorOrganizations);

/**
 * Code Graphs
 */
router.route('/:id/code/commits').get(repoController.getCommitsMade);
router.route('/:id/code/line-changes').get(repoController.getLinesTouched);

/**
 * Pull Requests / Code Reviews
 */
router.route('/:id/reviews/accepted').get(repoController.getReviewsAccepted);
router.route('/:id/reviews/rejected').get(repoController.getReviewsRejected);
router.route('/:id/reviews/average-time').get(repoController.getReviewsAvgTime);

/**
 * Issues / Bugs
 */
router.route('/:id/issues/opened').get(repoController.getIssuesOpened);
router.route('/:id/issues/closed').get(repoController.getIssuesClosed);
router.route('/:id/issues/activity').get(repoController.getIssuesActivity);
router.route('/:id/issues/age').get(repoController.getIssuesAge);
router.route('/:id/issues/avg-response-time').get(repoController.getIssuesAverageResponseTime);
router.route('/:id/issues/avg-time-spent').get(repoController.getIssuesAverageTimeSpent);

module.exports = router;
