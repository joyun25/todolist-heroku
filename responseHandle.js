const corsHeader = require("./corsHeader");

const successHandle = (res, todos) => {
  res.writeHead(200, corsHeader);
  res.write(JSON.stringify({
    "status": "success",
    "data": todos
  }));
  res.end();
}

const errorHandle = (res, statusCode, message) => {
  res.writeHead(statusCode, corsHeader);
  res.write(JSON.stringify({
    "status": "false",
    message
  }));
  res.end();
}

module.exports = {
  successHandle,
  errorHandle
};