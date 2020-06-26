jest.mock("../../models");
jest.mock("../../src/lib/github-tasks.js");
jest.mock("@octokit/app");
jest.mock("@octokit/rest");
const models = require("../../models");
const githubTasks = require('../../src/lib/github-tasks.js');
const octokitApp = require("@octokit/app");
const octokit = require("@octokit/rest");

const getInstallationAccessTokenMock = jest.fn(
  async (user) => user.installationId
);
const AppMock = jest.fn(() => ({
  getInstallationAccessToken: getInstallationAccessTokenMock
}));

const listReposMock = jest.fn(() => ({
  headers: {
    link: "<https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=1>;rel=\"prev\",\
    <https://api.github.com/user/repos?type=public&per_page=10&sort=updated&page=3>; rel=\"next\""
  },
  data: {
    repositories: ["repo_1", "repo_2"]
  }
}));
const getReposMock = jest.fn(() => ({
  data: {
    id: "GH_REPO_ID_TEST"
  }
}));
const OctokitMock = jest.fn(() => ({
  apps: { listRepos: listReposMock },
  repos: { get: getReposMock }
}));

const parseGithubHistoryThenMock = jest.fn();
const parseGithubHistoryMock =  jest.fn(() => ({
  then: parseGithubHistoryThenMock
}));

octokitApp.App = AppMock;
octokit.Octokit = OctokitMock;
githubTasks.parseGithubHistory = parseGithubHistoryMock;

const { mockRequest, mockResponse } = require("../utils/interceptor.js");
const {
  getGithubRepos,
  postTrackRepo,
  getLogout,
} = require("../../src/controllers/user.js");

beforeAll(() => {
  process.env = Object.assign(
    process.env,
    { GH_APP_ID: "GH_APP_ID_TEST" });
});

describe("Controller 'getGithubRepos' ", () => {
  test("should call listRepos with correct data, and respond with correct pagination.", async () => {
    const req = mockRequest("../fixtures/get_github_repos.json");
    const res = mockResponse();

    await getGithubRepos(req, res);

    expect(listReposMock).toHaveBeenCalledTimes(1);
    expect(listReposMock).toMatchSnapshot();

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'postTrackRepo' ", () => {
  test("should respond with success object, when user exists in request.", async () => {
    models.User = { update: jest.fn() };
    models.Repo = { upsert: jest.fn() };

    const req = mockRequest("../fixtures/post_track_repo.json");
    const res = mockResponse();

    await postTrackRepo(req, res);

    expect(getReposMock).toHaveBeenCalledTimes(1);
    expect(getReposMock).toMatchSnapshot();

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
    expect(models.Repo.upsert).toHaveBeenCalledTimes(1);
    expect(models.Repo.upsert).toMatchSnapshot();
    expect(models.User.update).toHaveBeenCalledTimes(1);
    expect(models.User.update).toMatchSnapshot();
  });

  test("should throw error if the user has already been tracking the repo.", async () => {
    const req = mockRequest("../fixtures/post_track_repo.json");
    const res = mockResponse();

    req.user.trackingRepo = true;

    // https://github.com/facebook/jest/issues/1700#issuecomment-377890222
    // eslint-disable-next-line jest/valid-expect
    expect(postTrackRepo(req, res)).rejects.toEqual(new Error("already tracking a repo"));
  });
});

describe("Controller 'getLogout' ", () => {
  test("should call logout and return with status 200 / OK.", async () => {
    const req = mockRequest();
    const res = mockResponse();

    req.logout = jest.fn();

    await getLogout(req, res);
    expect(req.logout).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});
