import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/helpers';
import { natsWrapper } from '../../NatsWrapper';

it('returns 404 if id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'some-title',
      price: 10
    })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`)
    .send({
      title: 'some-title',
      price: 10
    })
    .expect(401);
});

it('returns 401 if user does not own the ticket', async () => {
  const resp = await request(app).post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'some-title',
      price: 10
    });

  await request(app).put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'new-title',
      price: 20
    })
    .expect(401);
});

describe('test field validation', () => {
  it('returns 400 if title is invalid', async () => {
    const cookie = signin();
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'some-title',
        price: 10
      });

    await request(app).put(`/api/tickets/${resp.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 10
      })
      .expect(400);
  });

  it('returns 400 if price is invalid', async () => {
    const cookie = signin();
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'some-title',
        price: 10
      });

    await request(app).put(`/api/tickets/${resp.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'new-title',
        price: -10
      })
      .expect(400);
  });

});

it('returns 200 and updates ticket with valid inputs and permission', async () => {
  const cookie = signin();
  const resp = await request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some-title',
      price: 10
    });

  await request(app).put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new-title',
      price: 100
    })
    .expect(200);

  const ticketResp = await request(app).get(`/api/tickets/${resp.body.id}`).send();

  expect(ticketResp.body.title).toEqual('new-title');
  expect(ticketResp.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = signin();
  const resp = await request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some-title',
      price: 10
    });

  await request(app).put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new-title',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});