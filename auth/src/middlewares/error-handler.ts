import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/RequestValidationError';
import { DatabaseConnectionError } from '../errors/DatabaseConnectionError';

export const errorHandler = (
  err: Error, req: Request, res: Response, next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map(error => {
      return { message: error.msg, field: error.param };
    });
    return res.status(400).json({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).json({
      errors: [{ message: err.reason }]
    });
  }

  return res.status(400).send({
    errors: [{ message: 'Something went wrong...' }]
  });
};