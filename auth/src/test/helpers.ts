import request from 'supertest';
import { app } from '../app';

export const signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const resp = await request(app).post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201);

  const cookie = resp.get('Set-Cookie');

  return cookie;
};