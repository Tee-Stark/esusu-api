const responseHandler = (res, responseData) => {
  const { status, message, data, token } = responseData;
  const responseObj = {
    status,
    message,
    data,
    token: token || null,
  };
  return res.status(status).json(responseObj);
};

module.exports = {
  responseHandler,
}