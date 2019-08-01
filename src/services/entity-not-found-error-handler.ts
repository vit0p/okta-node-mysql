import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

export function entityNotFoundErrorHandler(error, req, res, next) {
  if (!(error instanceof EntityNotFoundError)) {
    return next(error);
  }

  res.status(401);
  res.json({ error: 'Not Found' });
}
