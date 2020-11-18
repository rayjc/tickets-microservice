import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/helpers';

const makeTicket = async (title = 'concert', price = 10) => {
  const ticket = Ticket.make({
    title,
    price
  });
  await ticket.save();

  return ticket;
};

it('returns orders for a specific user', async () => {
  // create three tickets
  const ticketOne = await makeTicket();
  const ticketTwo = await makeTicket();
  const ticketThree = await makeTicket('conference', 20);

  const userOneCookie = signin();
  const userTwoCookie = signin();
  // create one order as user1
  await request(app).post('/api/orders')
    .set('Cookie', userOneCookie)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two orders as user2
  const { body: orderOne } = await request(app).post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app).post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // verify orders for user2
  const resp = await request(app).get('/api/orders')
    .set('Cookie', userTwoCookie)
    .expect(200);

  expect(resp.body.length).toEqual(2);
  expect(resp.body[0].id).toEqual(orderOne.id);
  expect(resp.body[1].id).toEqual(orderTwo.id);
  expect(resp.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(resp.body[1].ticket.id).toEqual(ticketThree.id);
});