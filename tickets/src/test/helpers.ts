import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_KEY } from '../config';

export const signin = () => {
  // build a jwt payload of { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'batman@wayne.com'
  };
  // create jwt
  const token = jwt.sign(payload, JWT_KEY);
  // build session object
  const session = { jwt: token };
  // convert session object into JSON
  const sessionJSON = JSON.stringify(session);
  // encode JSON object in base64
  const sessionBase64 = Buffer.from(sessionJSON).toString('base64');
  // return cookie string with encoded object
  return [`express:sess=${sessionBase64}`];
};