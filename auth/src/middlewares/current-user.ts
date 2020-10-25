import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';

interface UserPayload {
  id: string;
  email: string;
}

// add currentUser to Request object
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Add current user info to request object if JWT is supplied
 * @param req 
 * @param res 
 * @param next 
 */
export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  // check if session and jwt cookie is available
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // extract payload from token
    const payload = jwt.verify(req.session.jwt, JWT_KEY) as UserPayload;
    req.currentUser = payload;
  } catch (error) { }

  return next();
};