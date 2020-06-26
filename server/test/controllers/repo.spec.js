jest.mock("../../models");
const models = require("../../models");

const { mockRequest, mockResponse } = require("../utils/interceptor.js");
const {
  getRepoDetails,
  getActivityDatesTimes,
  getTimeToFirstResponse,
  getContributors,
  getCommitsMade,
  getLinesTouched,
  getReviewsAccepted,
  getReviewsAvgTime,
  getIssuesOpened,
  getIssuesClosed,
  getIssuesActivity,
  getIssuesAge,
  getIssuesAverageResponseTime,
  getIssuesAverageTimeSpent
} = require("../../src/controllers/repo.js");

const RealDate = Date;

function mockDate (isoDate) {
  global.Date = class extends RealDate {
    constructor () {
      return new RealDate(isoDate)
    }
  }
}

beforeEach(() => {
  mockDate("2020-01-01");
});

afterEach(() => {
  global.Date = RealDate
})

describe("Controller 'getRepoDetails'", () => {
  test("should respond with correct repository details when the repo is tracked.", async () => {
    models.TrackedRepo = { findOne: jest.fn(() => true) };

    models.Repo = {
      findOne: jest.fn(() => ({
        name: "REPO_NAME_TEST",
        htmlUrl: "REPO_URL_TEST"
      }))
    };

    const req = mockRequest("../fixtures/get_repo_details.json");
    const res = mockResponse();
    await getRepoDetails(req, res);

    expect(models.TrackedRepo.findOne).toHaveBeenCalledTimes(1);
    expect(models.TrackedRepo.findOne).toMatchSnapshot();
    expect(models.Repo.findOne).toHaveBeenCalledTimes(1);
    expect(models.Repo.findOne).toMatchSnapshot();
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });

  test("should respond with 401, when the repo is not tracked by the user.", async () => {
    models.TrackedRepo = { findOne: jest.fn(() => false) };
    models.Repo = { findOne: jest.fn() };

    const req = mockRequest("../fixtures/get_repo_details.json");
    const res = mockResponse();
    await getRepoDetails(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({});
    expect(models.Repo.findOne).toHaveBeenCalledTimes(0);
  });
});

describe("Controller 'getActivityDatesTimes'", () => {
  test("should respond with correct activity dates and times of the repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Commit = {
      findAll: jest.fn(() => ([
        { committerDate: today }
      ]))
    };

    models.Issue = {
      findAll: jest.fn(() => ([
        { createdAt: yesterday }
      ]))
    };

    models.IssueEvent = {
      findAll: jest.fn(() => ([
        { createdAt: today }
      ]))
    };

    models.Review = {
      findAll: jest.fn(() => ([
        { createdAt: yesterday }
      ]))
    };

    models.ReviewEvent = {
      findAll: jest.fn(() => ([
        { createdAt: today }
      ]))
    };

    const req = mockRequest("../fixtures/get_activity_dates_times.json");
    const res = mockResponse();

    await getActivityDatesTimes(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getTimeToFirstResponse'", () => {
  test("should respond with correct time it takes to first response issues / reviews.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        createdAt: yesterday,
        id: "ISSUE_ID_TEST",
        userGithubId: "USER_ID_TEST"
      }]))
    };

    models.IssueEvent = {
      findAll: jest.fn(() => ([
        {
          createdAt: yesterday,
          issueId: "ISSUE_ID_TEST",
          authorGithubId: "AUTHOR_ID_TEST"
        },
        {
          createdAt: today,
          issueId: "ISSUE_ID_TEST",
          authorGithubId: "AUTHOR_ID_TEST_2"
        }
      ]))
    };

    models.Review = {
      findAll: jest.fn(() => ([{
        createdAt: yesterday,
        id: "REVIEW_ID_TEST",
        userGithubId: "USER_ID_TEST"
      }]))
    };

    models.ReviewEvent = {
      findAll: jest.fn(() => ([
        {
          createdAt: yesterday,
          reviewId: "REVIEW_ID_TEST",
          authorGithubId: "AUTHOR_ID_TEST"
        },
        {
          createdAt: today,
          reviewId: "REVIEW_ID_TEST",
          authorGithubId: "AUTHOR_ID_TEST_2"
        }
      ]))
    };

    const req = mockRequest("../fixtures/get_time_to_first_response.json");
    const res = mockResponse();

    await getTimeToFirstResponse(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  })
});

describe("Controller 'getContributors'", () => {
  test("should respond with contributors with their details.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Commit = {
      findAll: jest.fn(() => ([
        {
          committerDate: yesterday,
          name: "COMMIT_NAME",
          authorName: "COMMITTER_NAME"
        },
        {
          committerDate: today,
          name: "COMMIT_NAME_2",
          authorName: "COMMITTER_NAME"
        }
      ]))
    };

    models.Issue = {
      findAll: jest.fn(() => ([
        {
          createdAt: yesterday,
          userGithubId: "USER_ID_TEST"
        },
        {
          createdAt: today,
          userGithubId: "USER_ID_TEST"
        }
      ]))
    };

    models.IssueEvent = {
      findAll: jest.fn(() => ([
        {
          createdAt: yesterday,
          authorGithubId: "AUTHOR_ID_TEST"
        },
        {
          createdAt: today,
          authorGithubId: "AUTHOR_ID_TEST"
        }
      ]))
    };

    models.ReviewEvent = {
      findAll: jest.fn(() => ([
        {
          createdAt: yesterday,
          authorGithubId: "AUTHOR_ID_TEST"
        },
        {
          createdAt: today,
          authorGithubId: "AUTHOR_ID_TEST_2"
        }
      ]))
    };

    models.GithubUser = {
      findAll: jest.fn(() => ([{
        id: "USER_ID_TEST",
        name: "USER_NAME_TEST",
        email: "USER_EMAIL_TEST",
        login: "USER_LOGIN_TEST"
      }]))
    };

    const req = mockRequest("../fixtures/get_contributors.json");
    const res = mockResponse();

    await getContributors(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  })
});

describe("Controller 'getCommitsMade'", () => {
  test("should respond with commits on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Commit = {
      findAll: jest.fn(() => ([{
        committerDate: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_commits_made.json");
    const res = mockResponse();

    await getCommitsMade(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getLinesTouched'", () => {
  test("should respond with line changes on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Commit = {
      findAll: jest.fn(() => ([{
        committerDate: yesterday,
        lineAdditions: ["LINE_ADDITION_TEST"],
        lineDeletions: ["LINE_DELETION_TEST"]
      }]))
    };

    const req = mockRequest("../fixtures/get_lines_touched.json");
    const res = mockResponse();

    await getLinesTouched(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getReviewsAccepted'", () => {
  test("should respond with the number of accepted PRs on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Review = {
      findAll: jest.fn(() => ([{
        id: "REVIEW_ID_TEST",
        reviewId: "REVIEW_ID_TEST",
        action: "merged",
        closedAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_reviews_accepted.json");
    const res = mockResponse();

    await getReviewsAccepted(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getReviewsRejected'", () => {
  test("should respond with the number of rejected PRs on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Review = {
      findAll: jest.fn(() => ([{
        id: "REVIEW_ID_TEST",
        reviewId: "REVIEW_ID_TEST",
        action: "closed",
        closedAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_reviews_rejected.json");
    const res = mockResponse();

    await getReviewsAccepted(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getReviewsAvgTime'", () => {
  test("should respond with the average time it took to accept PRs on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Review = {
      findAll: jest.fn(() => ([{
        id: "REVIEW_ID_TEST",
        reviewId: "REVIEW_ID_TEST",
        action: "merged",
        closedAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_reviews_avg_time.json");
    const res = mockResponse();

    await getReviewsAvgTime(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});


describe("Controller 'getIssuesOpened'", () => {
  test("should respond with the number of new opened issues on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        createdAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_issues_opened.json");
    const res = mockResponse();

    await getIssuesOpened(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getIssuesClosed'", () => {
  test("should respond with the number of closed issues on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        closedAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_issues_closed.json");
    const res = mockResponse();

    await getIssuesClosed(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getIssuesActivity'", () => {
  test("should respond with the number of issues with activity on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        closedAt: yesterday
      }]))
    };

    const req = mockRequest("../fixtures/get_issues_closed.json");
    const res = mockResponse();

    await getIssuesActivity(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getIssuesAge'", () => {
  test("should respond with issue ages on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);

    const one_day_in_ms = 24 * 3600 * 1000;

    models.Issue = {
      findAll: jest.fn(() => ([
        { createdAt: yesterday },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 49) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 50) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 51) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 99) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 100) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 101) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 149) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 150) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 151) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 199) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 200) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 201) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 249) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 250) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 251) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 299) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 300) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 301) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 349) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 350) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 351) },
        { createdAt: new RealDate(today.getTime() - one_day_in_ms * 450) },
      ]))
    };

    const req = mockRequest("../fixtures/get_issues_age.json");
    const res = mockResponse();

    await getIssuesAge(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getIssuesAverageResponseTime'", () => {
  test("should respond with average response time for issues on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        createdAt: yesterday,
        id: "ISSUE_ID_TEST",
        userGithubId: "USER_ID_TEST"
      }]))
    };

    models.IssueEvent = {
      findAll: jest.fn(() => ([{
        issueId: "ISSUE_ID_TEST",
        authorGithubId: "USER_ID_TEST"
      }]))
    };

    const req = mockRequest("../fixtures/get_issues_age.json");
    const res = mockResponse();

    await getIssuesAverageResponseTime(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getIssuesAverageTimeSpent'", () => {
  test("should respond with the average time spent on issues, on the given repository.", async () => {
    const today = new Date();
    const yesterday = new RealDate(today.getTime() - 24 * 3600 * 1000);
    models.Issue = {
      findAll: jest.fn(() => ([{
        createdAt: yesterday,
        closedAt: today,
        id: "ISSUE_ID_TEST",
        userGithubId: "USER_ID_TEST"
      }]))
    };

    const req = mockRequest("../fixtures/get_issues_average_time_spent.json");
    const res = mockResponse();

    await getIssuesAverageTimeSpent(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});
