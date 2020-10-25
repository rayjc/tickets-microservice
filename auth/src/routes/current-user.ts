import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  // check if session and jwt cookie is available
  if (!req.session?.jwt) {
    console.log("no jwt cookie found");
    return res.json({ currentUser: null });
  }
  // extract payload from token
  try {
    const payload = jwt.verify(req.session.jwt, JWT_KEY);
    return res.json({ currentUser: payload });
  } catch (error) {
    return res.json({ currentUser: null });
  }
});


export { router as currentUserRouter };