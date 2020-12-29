import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/helpers';
import { sign } from 'jsonwebtoken';

it('returns an order', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const userCookie = signin();
  // create a new order on the ticket
  const { body: order } = await request(app).post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // attempt to fetch the order
  const resp = await request(app).get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(resp.body.id).toEqual(order.id);
});

it('returns 401 if user does not own the order', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const userCookie = signin();
  // create a new order on the ticket
  const { body: order } = await request(app).post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // attempt to fetch the order with a different user
  await request(app).get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401);
});