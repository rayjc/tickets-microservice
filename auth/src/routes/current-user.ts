import express from 'express';
import { currentUser } from '@rayjc-dev/common';
import { JWT_KEY } from '../config';

const router = express.Router();

router.get('/api/users/currentuser', currentUser(JWT_KEY), (req, res) => {
  res.json({ currentUser: req.currentUser || null });
});


export { router as currentUserRouter };