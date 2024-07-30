module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  res.status(statusCode).send({ message });
};
