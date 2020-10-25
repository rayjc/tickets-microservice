import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';
import { User } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 })
      .withMessage('Password must have 4-20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already exists.');
    }
    // create and write user to db
    const user = User.make({ email, password });
    await user.save();
    // create jwt
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, JWT_KEY);
    // store jwt on session/cookie
    req.session = {
      ...req.session,
      jwt: userJwt
    };

    return res.status(201).send(user);
  });


export { router as signupRouter };