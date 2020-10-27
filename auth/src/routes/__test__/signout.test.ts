import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/helpers';

it('clears the cookie after signing out', async () => {
  await signup();

  const resp = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(resp.get('Set-Cookie')).toBeUndefined();
});
