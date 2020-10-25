import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { PasswordManager } from '../helpers/PasswordManager';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage("Please provide password!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check user exists
    const existingUser = await User.findOne({ email, });
    if (!existingUser) {
      throw new BadRequestError('Invalid User/password');
    }

    // verify password
    const isValidPassword = await PasswordManager.compare(
      existingUser.password, password
    );
    if (!isValidPassword) {
      throw new BadRequestError('Invalid User/Password');
    }

    // create jwt
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, JWT_KEY);
    // store jwt on session/cookie
    req.session = {
      ...req.session,
      jwt: userJwt
    };

    res.status(200).send(existingUser);
  });


export { router as signinRouter };