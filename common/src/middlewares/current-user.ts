import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
 * @param jwtKey 
 */
export const currentUser = (jwtKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // check if session and jwt cookie is available
    if (!req.session?.jwt) {
      return next();
    }

    try {
      // extract payload from token
      const payload = jwt.verify(req.session.jwt, jwtKey) as UserPayload;
      req.currentUser = payload;
    } catch (error) { }

    return next();
  };
};