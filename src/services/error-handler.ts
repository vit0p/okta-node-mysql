export function errorHandler(error, req, res, next) {
  if (!error) {
    return next();
  }


  if (error) {
    res.status(500);
    res.json({ error: error.message });
  }
  console.error(error);
}
