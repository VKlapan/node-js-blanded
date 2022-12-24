module.exports = (err, req, res, next) => {
  let statusCode = null;

  console.log(err);

  if (res.statusCode) {
    statusCode = res.statusCode;
  } else {
    statusCode = 500;
  }

  res.status(statusCode).json({ message: err.message, stack: err.stack });
  next();
};
