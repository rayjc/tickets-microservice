import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import mongoose from 'mongoose';

it('returns a 404 if the specified ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('returns the specified ticket if it exists in db', async () => {
  const title = 'some-title';
  const price = 10;

  const resp = await request(app).post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title, price,
    }).expect(201);

  const ticketResp = await request(app).get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  expect(ticketResp.body.title).toEqual(title);
  expect(ticketResp.body.price).toEqual(price);
});