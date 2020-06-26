jest.mock("../../models");
const models = require("../../models");
const { mockRequest, mockResponse } = require("../utils/interceptor.js");
const { getUser } = require("../../src/controllers/account.js");

describe("Controller 'getUser' ", () => {
  test("should respond with an object with `null` user, when user doesn't exist in request.", async () => {
    models.User = {
      findOne: jest.fn()
    };

    const req = mockRequest();
    const res = mockResponse();
    await getUser(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
    expect(models.User.findOne).toHaveBeenCalledTimes(0);
  });

  test("should respond with user model, when user exists in request.", async () => {
    models.User = {
      findOne: jest.fn()
    };

    models.User.findOne.mockReturnValue({ id: "USER_ID_TEST" });

    const req = mockRequest("../fixtures/get_user.json");
    const res = mockResponse();

    await getUser(req, res);

    expect(models.User.findOne).toHaveBeenCalledTimes(1);
    expect(models.User.findOne).toMatchSnapshot()

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toMatchSnapshot();
  });
});
