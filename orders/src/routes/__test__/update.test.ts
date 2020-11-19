import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/helpers';
import { Order } from '../../models/order';
import { OrderStatus } from '@rayjc-dev/common';
import { natsWrapper } from '../../NatsWrapper';

it('update an order to be cancelled', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const userCookie = signin();
  // create an order
  const { body: order } = await request(app).post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.status).not.toEqual(OrderStatus.Cancelled);

  // cancel the order
  await request(app).patch(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes an order cancelled event', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const userCookie = signin();
  // create an order
  const { body: order } = await request(app).post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.status).not.toEqual(OrderStatus.Cancelled);

  // reset mock context, ie. counter
  jest.clearAllMocks();
  // cancel the order
  await request(app).patch(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});