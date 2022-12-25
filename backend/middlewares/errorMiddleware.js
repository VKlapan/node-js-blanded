const errorMiddleware = async (err, req, res, next) => {
  let statusCode = null;

  console.log("ERROR!!!", err);

  if (res.statusCode) {
    statusCode = res.statusCode;
  } else {
    statusCode = 500;
  }

  res.status(statusCode).json({ message: err.message, stack: err.stack });
  next();
};

module.exports = errorMiddleware;
