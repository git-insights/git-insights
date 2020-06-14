exports.mockRequest =  function(bodyPath, params) {
  let req = {};
  req.body = jest.fn().mockReturnValue(req);
  req.params = jest.fn().mockReturnValue(req);

  if (bodyPath) {
    req = require(bodyPath);
  }

  if (params) {
    req.params = params;
  }

  return req;
}

exports.mockResponse = function() {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
