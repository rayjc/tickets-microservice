import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@rayjc-dev/common';
import { natsWrapper } from '../../NatsWrapper';

it('returns 404 if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app).post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404);
});

it('returns 400 if ticket is reserved', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10
  });
  await ticket.save();
  // reserve the ticket
  const order = Order.make({
    ticket,
    userId: 'some-id',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  // attempt to reserve ticket again
  await request(app).post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('returns 201 if successfully reserves ticket', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10
  });
  await ticket.save();
  // attempt to reserve the ticket
  await request(app).post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('publishes an order created event', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10
  });
  await ticket.save();
  // attempt to reserve the ticket
  await request(app).post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});