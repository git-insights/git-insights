const models = require('../../models');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Los_Angeles');

/**
 *  GET /repo/:id/stargazers
 *  Given repo id, this route returns stargazers
 */
exports.getStargazers = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Cache
  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazers`
    }
  });

  // if it's a cache hit, display cache
  if (cache) return res.json(cache.data);

  const repo = await models.Repo.findByPk(id);

  // if not found return empty
  if (repo === null) return res.json({});

  const repoCreateDate = repo.created_at;

  // Date repo is created
  const repoCreateMonth = repoCreateDate.getMonth() + 1;
  const repoCreateYear = repoCreateDate.getFullYear();

  // Current year
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalMonths = (currentYear - repoCreateYear) * 12 + (currentMonth - repoCreateMonth);

  // Fetch all the stargazes that fit our criteria
  const stargazes = await models.Stargaze.findAll({
    where: {
      repo_id: id
    }
  });

  // x: ["feb 12, march 12, ..."]
  // y: [10, 15, 13, 17],

  const monthToText = (month) => {
    switch(month) {
      case 0: return "Jan";
      case 1: return "Feb";
      case 2: return "Mar";
      case 3: return "Apr";
      case 4: return "May";
      case 5: return "Jun";
      case 6: return "Jul";
      case 7: return "Aug";
      case 8: return "Sep";
      case 9: return "Oct";
      case 10: return "Nov";
      case 11: return "Dec";
    }
  }

  // Populate Data
  const x = [];
  for (let month = 0; month < totalMonths; month++) {
    let curMonth = month % 12;
    x.push(`${monthToText(curMonth)} ${Math.floor(month / 12) + repoCreateYear}`);
  }
  let y = [...Array(totalMonths)].map(()=>0);

  // Compute Stargazes
  for (let gaze of stargazes) {
    const date = gaze.stargazed_at;
    const gazeMonth = date.getMonth() + 1;
    const gazeYear = date.getFullYear();

    const target = (gazeYear - repoCreateYear) * 12 + (gazeMonth - repoCreateMonth);
    y[target]++;
  }

  // Cummulative Stars
  y = y.reduce((a, x, i) => [...a, x + (a[i-1] || 0)], []);

  return res.json({
    x,
    y
  });
});

/**
 *  GET /repo/:id/stargazer-orgs
 *  Given repo id, this route returns organizations of the stargazers
 */
exports.getStargazerOrgs = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const companies = {};

  // Cache
  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazer-orgs`
    }
  });

  if (cache) return res.json(cache.data);

  // Fetch all the stargazes that fit our criteria
  let stargazers = await models.Stargaze.findAll({
    where: {
      repo_id: id
    }
  });

  // if not found return empty
  if (stargazers === null) return res.json({});

  // Horrible
  const normalizeCompany = (name) => {
    name = name.toLocaleLowerCase();
    if (name[0] === '@') {
      name = name.substring(1);
    }
    return name;
  }

  stargazers = stargazers.map(stargaze => stargaze.user_id);

  for (let stargazerId of stargazers) {
    let user = await models.GithubUser.findByPk(stargazerId);
    if (user.company === null) continue;
    let company = normalizeCompany(user.company);
    if (companies[company]) {
      companies[company]++;
    } else {
      companies[company] = 1;
    }
  }

  return res.json(companies);
});

/**
 *  GET /repo/:id/stargazer-orgs-top10
 *  Given repo id, this route returns top 10 organizations of the stargazers
 */
exports.getStargazerTopOrgs = asyncHandler(async(req, res) => {
  const id = req.params.id;

  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazer-orgs-top10`
    }
  });

  // too expensive to calculate realtime
  // use only from cache
  if (cache) {
    return res.json(cache.data);
  } else {
    return res.json([]);
  }
});

/**
 *  GET /repo/:id/stargazer-countries
 *  Given repo id, this route returns countries of the stargazers
 */
exports.getStargazerCountries = asyncHandler(async(req, res) => {
  const id = req.params.id;
  const countries = {};

  // Cache
  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazer-countries`
    }
  });

  if (cache) return res.json(cache.data);

  // Fetch all the stargazes that fit our criteria
  let stargazers = await models.Stargaze.findAll({
    where: {
      repo_id: id
    }
  });

  // if not found return empty
  if (stargazers === null) return res.json({});

  stargazers = stargazers.map(stargaze => stargaze.user_id);

  for (let stargazerId of stargazers) {
    let user = await models.GithubUser.findByPk(stargazerId);
    if (user.country === '' || user.country === null) continue;
    let country = user.country;
    if (countries[country]) {
      countries[country]++;
    } else {
      countries[country] = 1;
    }
  }

  return res.json(countries);
});

/**
 *  GET /repo/:id/stargazer-topcities
 *  Given repo id, this route returns top countries of the stargazers
 */
exports.getStargazerTopCities = asyncHandler(async(req, res) => {
  const id = req.params.id;
  let tempLocations = {};

  // Cache
  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazer-topcities`
    }
  });

  if (cache) return res.json(cache.data);

  // Fetch all the stargazes that fit our criteria
  let stargazers = await models.Stargaze.findAll({
    where: {
      repo_id: id
    }
  });

  // if not found return empty
  if (stargazers === null) return res.json([]);

  stargazers = stargazers.map(stargaze => stargaze.user_id);

  for (let stargazerId of stargazers) {
    let user = await models.GithubUser.findByPk(stargazerId);
    if (user.country === '' || user.country === null || user.city === '') continue;
    let location = user.city + user.country;
    if (tempLocations[location]) {
      tempLocations[location].count++;
    } else {
      tempLocations[location] = {};
      tempLocations[location].count = 1;
      tempLocations[location].city = user.city;
      tempLocations[location].country = user.country;
    }
  }

  tempLocations = Object.values(tempLocations);
  tempLocations.sort((a, b) => b.count - a.count);
  tempLocations = tempLocations.slice(0, 10);

  return res.json(tempLocations);
});

/**
 *  GET /repo/:id/stargazer-toprepos
 *  Given repo id, this route returns the top shared repos of the stargazers
 */
exports.getStargazerTopRepos = asyncHandler(async(req, res) => {
  const id = req.params.id;
  // const query = '/repo/:id/stargazer-toprepos'

  let cache = await models.Cache.findOne({
    where: {
      query: `/repo/${id}/stargazer-toprepos`
    }
  });

  // too expensive to calculate realtime
  // use only from cache
  if (cache) {
    return res.json(cache.data);
  } else {
    return res.json([]);
  }
});

/**
 *  Dashboard Graphs

  == TODO ==
  -> Check if repo id is valid
  -> Check if repo belongs to user
  -> Add start and end date, currently 1-month rolling window
  -> Cache some of this function. We can at least make it hourly

 */

/**
 * GET /repo/:id/activity-dates-times
 * Given repo id, return the number of activities and when they happened
 */
exports.getActivityDatesTimes = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = new Date(new Date() - 24 * 60 * 60 * 1000 * 14);
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const day = time.getDay();
    const hour = time.getHours();

    return [day, hour];
  }

  // Fetch all the activity that has happened within the last 2 weeks
  let activities = [
    Array(24).fill(0),
    Array(24).fill(0),
    Array(24).fill(0),
    Array(24).fill(0),
    Array(24).fill(0),
    Array(24).fill(0),
    Array(24).fill(0),
  ];

  // Commits
  const commits = await models.Commit.findAll({
    where: {
      repoId: repoId,
      committerDate: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Add them to activities table
  commits.forEach(commit => {
    let idx = timeToArraySlot(commit.committerDate);
    activities[idx[0]][idx[1]]++;
  })

  // Issues/Bugs
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Add issues to activities table
  issues.forEach(event => {
    let idx = timeToArraySlot(event.createdAt);
    activities[idx[0]][idx[1]]++;
  });

  // Issue Events
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Add issue events to activities table
  issueEvents.forEach(event => {
    let idx = timeToArraySlot(event.createdAt);
    activities[idx[0]][idx[1]]++;
  })

  // Code reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Add code reviews to activities table
  reviews.forEach(event => {
    let idx = timeToArraySlot(event.createdAt);
    activities[idx[0]][idx[1]]++;
  });

  // Code Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Add code review events to activities table
  reviewEvents.forEach(event => {
    let idx = timeToArraySlot(event.createdAt);
    activities[idx[0]][idx[1]]++;
  });

  // Mock data
  let data = [
    {
      z: activities,
      x: [
        '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
        '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
      ],
      y: ['Sun', 'Sat', 'Fri', 'Thurs', 'Wed', 'Tues', 'Mon'],
      xgap: 2,
      ygap: 2,
      type: 'heatmap',
      hoverongaps: false,
      colorscale: [
        [0.0, '#f8fcff'],
        [0.2, '#deedfc'],
        [0.4, '#b2d1f7'],
        [0.6, '#5889e0'],
        [0.8, '#3b5998'],
        [1.0, '#203451'],
      ],
      showscale: false,
      zmin: 0,
      zmax: 5,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/time-to-first-response
 * Given repo id, return the time it takes to first response issues & reviews
 */
exports.getTimeToFirstResponse = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Issue Events
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = [...Array(14)].map(_ => []);

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.createdAt);
    let issueAuthor = issue.userGithubId;

    let shortList = issueEvents.filter(event => {
      return event.issueId === issue.id && event.authorGithubId !== issueAuthor;
    });

    if (shortList.length > 0) {
      shortList = shortList.sort((first, second) => first.createdAt - second.createdAt);
      const firstResponseEvent = shortList[0];
      let timeDiff = moment(firstResponseEvent.createdAt).diff(moment(issue.createdAt), 'hours', true);``
      activities[slot].push(timeDiff);
    }
  });

  reviews.forEach(review => {
    let slot = timeToArraySlot(review.createdAt);
    let reviewAuthor = review.userGithubId;

    let shortList = reviewEvents.filter(event => {
      return event.reviewId === review.id && event.authorGithubId !== reviewAuthor
        && event.authorGithubId !== null;
    });

    if (shortList.length > 0) {
      shortList = shortList.sort((first, second) => first.createdAt - second.createdAt);
      const firstResponseEvent = shortList[0];
      let timeDiff = moment(firstResponseEvent.createdAt).diff(moment(review.createdAt), 'hours', true);``
      activities[slot].push(timeDiff);
    }
  });

  // Unique count
  activities = activities.map(slot => {
    if (slot.length === 0) {
      return 0;
    } else {
      return slot.reduce((previous, current) => current += previous) / slot.length;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/contributors
 * Given repo id, return the list of contributors
 */
/**
 * 2 forms of identity:
 *  1. email + name
 *  2. github_id + github_login
 *
 * TODO: merge these two in the future
 */
exports.getContributors = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  // Commits
  const commits = await models.Commit.findAll({
    where: {
      repoId: repoId,
      committerDate: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  let committers = [];

  commits.forEach(commit => {
    committerIndex = committers.findIndex(committer => {
      return committer.name === commit.authorName;
    });

    if (committerIndex >= 0) {
      committers[committerIndex].total++;
      committers[committerIndex].code++;
    } else {
      committers.push({
        name: commit.authorName,
        total: 1,
        code: 1,
        issues: 0,
        reviews: 0,
      })
    }
  });

  const githubIdList = {};

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Issue Events:
  // commented, labeled, unlabeled, renamed, reopened
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      action: {
        [Op.or]: ['commented', 'labeled', 'unlabeled', 'renamed', 'reopened' ],
      },
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Review Events:
  // review-commented, renamed, commented
  // review_requested, committed, closed, labeled,
  // unlabeled, merged, review-changes_requested
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      action: {
        [Op.or]: [ 'review-commented', 'commented', 'closed', 'review-changes_requested' ],
      },
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Start joining lists together
  issues.forEach(issue => {
    if (!githubIdList[issue.userGithubId]) {
      githubIdList[issue.userGithubId] = { issues: 1, reviews: 0, code: 0 };
    } else {
      githubIdList[issue.userGithubId].issues++;
    }
  });

  issueEvents.forEach(event => {
    if (!githubIdList[event.authorGithubId]) {
      githubIdList[event.authorGithubId] = { issues: 1, reviews: 0, code: 0 };
    } else {
      githubIdList[event.authorGithubId].issues++;
    }
  });

  // Definition of a review:
  // Review Event is one of the [ 'review-commented', 'commented',
  // 'closed', 'review-changes_requested' ] and it's not by the same person
  // who opened the PR
  reviewEvents.forEach(event => {
    if (!githubIdList[event.authorGithubId]) {
      githubIdList[event.authorGithubId] = { issues: 0, reviews: 1, code: 0 };
    } else {
      githubIdList[event.authorGithubId].reviews++;
    }
  })

  // Resolve github ids and write to final array
  const contributors = [];

  const githubUsers = await models.GithubUser.findAll({
    where: {
      id: Object.keys(githubIdList)
    }
  });

  githubUsers.forEach(user => {
    let tempUser = githubIdList[user.id];
    tempUser.total = tempUser.code + tempUser.issues + tempUser.reviews;
    if (user.name) {
      tempUser.name = user.name;
    } else if (user.email) {
      tempUser.name = user.email;
    } else {
      tempUser.name = user.login;
    }
    contributors.push(tempUser);
  });

  let mergeHash = {};
  committers.forEach(committer => {
    mergeHash[committer.name] = committer;
  });
  contributors.forEach(contributor => {
    if (mergeHash[contributor.name]) {
      mergeHash[contributor.name].total += contributor.total;
      mergeHash[contributor.name].code += contributor.code;
      mergeHash[contributor.name].issues += contributor.issues;
      mergeHash[contributor.name].reviews += contributor.reviews;
    } else {
      mergeHash[contributor.name] = contributor;
    }
  });

  // { name: "Murat Sutunc", total: 10, code: 5, issues: 3, reviews: 2 },
  // { name: "Nicole Bowers", total: 10, code: 5, issues: 3, reviews: 2 },
  const data = [];

  Object.entries(mergeHash).forEach(([key, value]) => {
    data.push({
      name: key,
      total: value.total,
      issues: value.issues,
      code: value.code,
      reviews: value.reviews,
    })
  });

  // Sort according to total activity
  data.sort((a, b) => b.total - a.total);

  return res.json(data);
});

/**
 * GET /repo/:id/contributors/organizations
 * Given repo id, return the organizations of contributors
 */
exports.getContributorOrganizations = asyncHandler(async(req, res) => {
  const data = {
    "Microsoft": 3,
    "Apple": 2,
    "Google": 1,
  }

  return res.json(data);
});

/**
 *  Code Graphs
 */

/**
 * GET /repo/:id/code/commits
 * Given repo id, return the commits on repo
 */
exports.getCommitsMade = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = new Date(new Date() - 24 * 60 * 60 * 1000 * 14);
  const endDate = new Date();

  // Beginning of start date is always 15 days ago, we need to
  // +/- 1 indexes where necessary
  const beginOfStartDate = moment(startDate).startOf('day');
  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(beginOfStartDate, 'days');
    return diff;
  }

  // Commits
  const commits = await models.Commit.findAll({
    where: {
      repoId: repoId,
      committerDate: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = Array(14).fill(0);

  commits.forEach(commit => {
    let slot = timeToArraySlot(commit.committerDate);
    activities[slot - 1]++;
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
})

/**
 * GET /repo/:id/code/line-changes
 * Given repo id, return the line changes on repo
 */
exports.getLinesTouched = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = new Date(new Date() - 24 * 60 * 60 * 1000 * 14);
  const endDate = new Date();

  // Beginning of start date is always 15 days ago, we need to
  // +/- 1 indexes where necessary
  const beginOfStartDate = moment(startDate).startOf('day');
  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(beginOfStartDate, 'days');
    return diff;
  }

  // Commits
  const commits = await models.Commit.findAll({
    where: {
      repoId: repoId,
      committerDate: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let additionActivities = Array(14).fill(0);
  let deletionActivities = Array(14).fill(0);

  commits.forEach(commit => {
    let slot = timeToArraySlot(commit.committerDate);
    additionActivities[slot - 1] += commit.lineAdditions;
    deletionActivities[slot - 1] += commit.lineDeletions;
  });

  const additions = {
    x: dates,
    y: additionActivities,
    type: 'bar',
    hoverongaps: false,
    marker: {
      color: '#3f51b5'
    },
    showscale: false,
    hoverinfo: 'skip',
    name: 'Additions'
  };

  const deletions = {
    x: dates,
    y: deletionActivities,
    type: 'bar',
    hoverongaps: false,
    marker: {
      color: '#ff7f0e'
    },
    showscale: false,
    hoverinfo: 'skip',
    name: 'Deletions'
  };


  // Mock data
  const data = [ additions, deletions  ];

  return res.json(data);
});

/**
 * Pull Requests / Changesets
 */

/**
 * GET /repo/:id/reviews/accepted
 * Given repo id, return the number of accepted PRs
 */
exports.getReviewsAccepted = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
      closedAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      reviewId: reviews.map(review => review.id)
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = Array(14).fill(0);

  reviews.forEach(review => {
    const relevantEvents = reviewEvents.filter(event => event.reviewId === review.id);
    const found = relevantEvents.findIndex(event => event.action === 'merged');

    if (found >= 0) {
      let slot = timeToArraySlot(review.closedAt);
      activities[slot]++;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/reviews/rejected
 * Given repo id, return the number of rejected PRs
 */
exports.getReviewsRejected = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
      closedAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      reviewId: reviews.map(review => review.id)
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = Array(14).fill(0);

  reviews.forEach(review => {
    const relevantEvents = reviewEvents.filter(event => event.reviewId === review.id);
    const found = relevantEvents.findIndex(event => event.action === 'merged');

    if (found === -1) {
      let slot = timeToArraySlot(review.closedAt);
      activities[slot]++;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/reviews/average-time
 * Given repo id, return the avg time it took to accept a PRs
 */
exports.getReviewsAvgTime = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Reviews
  const reviews = await models.Review.findAll({
    where: {
      repoId: repoId,
      closedAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Review Events
  const reviewEvents = await models.ReviewEvent.findAll({
    where: {
      reviewId: reviews.map(review => review.id)
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = [...Array(14)].map(_ => []);

  reviews.forEach(review => {
    const relevantEvents = reviewEvents.filter(event => event.reviewId === review.id);
    const found = relevantEvents.findIndex(event => event.action === 'merged');

    if (found >= 0) {
      let slot = timeToArraySlot(review.closedAt);
      let timeDiff = moment(review.closedAt).diff(moment(review.createdAt), 'hours', true);
      activities[slot].push(timeDiff);
    }
  });

  activities = activities.map(slot => {
    if (slot.length === 0) {
      return 0;
    } else {
      return slot.reduce((previous, current) => current += previous) / slot.length;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * Issues / Bugs
 */

 /**
 * GET /repo/:id/issues/opened
 * Given repo id, return the number of new opened issues
 */
exports.getIssuesOpened = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = new Date(new Date() - 24 * 60 * 60 * 1000 * 14);
  const endDate = new Date();

  // Beginning of start date is always 15 days ago, we need to
  // +/- 1 indexes where necessary
  const beginOfStartDate = moment(startDate).startOf('day');
  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(beginOfStartDate, 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = Array(14).fill(0);

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.createdAt);
    activities[slot - 1]++;
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

 /**
 * GET /repo/:id/issues/closed
 * Given repo id, return the number of closed issues
 */
exports.getIssuesClosed = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      closedAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = Array(14).fill(0);

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.closedAt);
    activities[slot]++;
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

 /**
 * GET /repo/:id/issues/activity
 * Given repo id, return the number of issues with activity
 */
exports.getIssuesActivity = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Issue Events
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = [...Array(14)].map(_ => ({}));

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.createdAt);
    activities[slot][issue.id] = true;
  });

  issueEvents.forEach(event => {
    let slot = timeToArraySlot(event.createdAt);
    activities[slot][event.issueId] = true;
  });

  // Unique count
  activities = activities.map(slot => {
    return Object.keys(slot).length;
  })

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/issues/age
 */
exports.getIssuesAge = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      state: 'open'
    }
  });

  let dates = ['0-49', '50-99', '100-149', '150-199', '200-249', '250-299', '300-349', '350+'];
  let activities = [...Array(14)].fill(0);

  issues.forEach(issue => {
    const diff = moment(moment(new Date())).diff(issue.createdAt, 'days')
    if (diff >= 0 && diff < 50) {
      activities[0]++;
    } else if (diff >= 50 && diff < 100) {
      activities[1]++;
    } else if (diff >= 100 && diff < 150) {
      activities[2]++;
    } else if (diff >= 150 && diff < 200) {
      activities[3]++;
    } else if (diff >= 200 && diff < 250) {
      activities[4]++;
    } else if (diff >= 250 && diff < 300) {
      activities[5]++;
    } else if (diff >= 300 && diff < 350) {
      activities[6]++;
    } else if (diff >= 350) {
      activities[7]++;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/issues/avg-response-time
 */
exports.getIssuesAverageResponseTime = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Issue Events
  const issueEvents = await models.IssueEvent.findAll({
    where: {
      repoId: repoId,
      isBot: false,
      createdAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = [...Array(14)].map(_ => []);

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.createdAt);
    let issueAuthor = issue.userGithubId;

    let shortList = issueEvents.filter(event => {
      return event.issueId === issue.id && event.authorGithubId !== issueAuthor;
    });

    if (shortList.length > 0) {
      shortList = shortList.sort((first, second) => first.createdAt - second.createdAt);
      const firstResponseEvent = shortList[0];
      let timeDiff = moment(firstResponseEvent.createdAt).diff(moment(issue.createdAt), 'hours', true);``
      activities[slot].push(timeDiff);
    }
  });

  // Unique count
  activities = activities.map(slot => {
    if (slot.length === 0) {
      return 0;
    } else {
      return slot.reduce((previous, current) => current += previous) / slot.length;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});

/**
 * GET /repo/:id/issues/avg-time-spent
 */
exports.getIssuesAverageTimeSpent = asyncHandler(async(req, res) => {
  const repoId = req.params.id;

  const startDate = moment(new Date() - 24 * 60 * 60 * 1000 * 13).startOf('day').toDate();
  const endDate = new Date();

  const timeToArraySlot = (time) => {
    const diff = moment(time).diff(moment(startDate), 'days');
    return diff;
  }

  // Issues
  const issues = await models.Issue.findAll({
    where: {
      repoId: repoId,
      closedAt: {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: startDate,
        }
      }
    }
  });

  // Create the array with decrementing index 13, 12, ..., 0
  // once we have the array map them to days
  let dates = [...Array(14)].map((_, index) => 13 - index);
  dates = dates.map(distance => {
    let date = moment(new Date()).subtract(distance, 'day');
    date = date.format('MMM DD');
    return date;
  });

  let activities = [...Array(14)].map(_ => []);

  issues.forEach(issue => {
    let slot = timeToArraySlot(issue.closedAt);
    let timeDiff = moment(issue.closedAt).diff(moment(issue.createdAt), 'hours', true);
    activities[slot].push(timeDiff);
  });

  // Unique count
  activities = activities.map(slot => {
    if (slot.length === 0) {
      return 0;
    } else {
      return slot.reduce((previous, current) => current += previous) / slot.length;
    }
  });

  const data = [
    {
      x: dates,
      y: activities,
      type: 'bar',
      hoverongaps: false,
      marker: {
        color: '#3f51b5'
      },
      showscale: false,
      hoverinfo: 'skip'
    }
  ];

  return res.json(data);
});
