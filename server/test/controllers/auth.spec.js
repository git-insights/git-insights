const { mockRequest, mockResponse } = require("../utils/interceptor.js");
const {
  getLoginSuccess,
  getLoginFailure,
  getLogout,
  postGithubAuthenticate
} = require("../../src/controllers/auth.js");

describe("Controller 'getLoginSuccess' ", () => {
  test("should respond with success object, when user exists in request.", async () => {
    const req = mockRequest("../fixtures/get_login_success.json");
    const res = mockResponse();
    await getLoginSuccess(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
  test("should not respond, when user doesn't exist on request.", async () => {
    const req = mockRequest();
    const res = mockResponse();
    await getLoginSuccess(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});

describe("Controller 'getLoginFailure' ", () => {
  test("should respond with 401 status and failure object.", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getLoginFailure(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});

describe("Controller 'getLogout' ", () => {
  test("should call logout and redirect to client home page.", async () => {
    const req = mockRequest();
    const res = mockResponse();
    req.logout = jest.fn().mockReturnValue(req);
    res.redirect = jest.fn().mockReturnValue(req);

    await getLogout(req, res);

    expect(req.logout).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledTimes(1);

    // NOTE: this will break when constant `CLIENT_HOME_PAGE_URL` is used;
    expect(res.redirect).toMatchSnapshot();
  });
});

describe("Controller 'postGithubAuthenticate' ", () => {
  test("should respond with 401 status and failure message, when user doesn't exist in request", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    await postGithubAuthenticate(req, res, next);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toMatchSnapshot();
    expect(next).toHaveBeenCalledTimes(0);
  });

  test("should set req.auth object with user id and call next, when user exists in request", async () => {
    const req = mockRequest("../fixtures/post_github_authenticate.json");
    const res = mockResponse();
    const next = jest.fn();

    await postGithubAuthenticate(req, res, next);

    expect(res.send).toHaveBeenCalledTimes(0);
    expect(req.auth).toMatchSnapshot();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
