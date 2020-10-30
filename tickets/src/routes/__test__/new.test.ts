import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const resp = await request(app).post('/api/tickets').send({});
  expect(resp.status).not.toBe(404);
});

it('can only be accessed if the user is signed in', async () => {
  const resp = await request(app).post('/api/tickets').send({});
  expect(resp.status).toBe(401);
});

it('returns a status other than 401 if user is signed in', async () => {
  const resp = await request(app).post('/api/tickets')
    .set('Cookie', signin())
    .send({});

  expect(resp.status).not.toBe(401);
});

describe('test field validation', async () => {
  it('returns an error if an invalid title is provided', async () => {
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', signin())
      .send({
        title: '',
        price: 10
      });

    expect(resp.status).toBe(400);
  });

  it('returns an error if title is not provided', async () => {
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', signin())
      .send({
        price: 10
      });

    expect(resp.status).toBe(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', signin())
      .send({
        title: "some-title",
        price: -10
      });

    expect(resp.status).toBe(400);
  });

  it('returns an error if price is not provided', async () => {
    const resp = await request(app).post('/api/tickets')
      .set('Cookie', signin())
      .send({
        title: "some-title"
      });

    expect(resp.status).toBe(400);
  });
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'some-title';
  const price = 100;
  const resp = await request(app).post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title, price,
    });

  expect(resp.status).toBe(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});