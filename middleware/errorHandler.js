module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.errors || undefined;
  res.status(status).json({ message, details });
};
