import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async () => {
  return request(app).post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

describe('test field validation', () => {
  it('returns 400 on invalid email', async () => {
    return request(app).post('/api/users/signup')
      .send({
        email: 'invalid_email',
        password: 'password'
      })
      .expect(400);
  });

  it('returns 400 on invalid password', async () => {
    return request(app).post('/api/users/signup')
      .send({
        email: 'new@test.com',
        password: '123'
      })
      .expect(400);
  });

  it('returns 400 on missing email', async () => {
    return request(app).post('/api/users/signup')
      .send({
        email: '',
        password: 'n/a'
      })
      .expect(400);
  });

  it('returns 400 on missing password', async () => {
    return request(app).post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: ''
      })
      .expect(400);
  });

});

it('fails and returns 400 on duplicate email', async () => {
  await request(app).post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app).post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie on successful signup', async () => {
  const resp = await request(app).post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(resp.get('Set-Cookie')).toBeDefined();
  expect(resp.get('Set-Cookie')[0]).toContain('express:');
  expect(resp.get('Set-Cookie')[0]).toContain('httponly');
});