import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/helpers';

it('responds with current user detail', async () => {
  // create a new user and get cookie
  const cookie = await signup();

  const resp = await request(app).get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(resp.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const resp = await request(app).get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(resp.body.currentUser).toBeNull();
});