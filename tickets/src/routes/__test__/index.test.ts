import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';

const createTicket = (title: string, price: number) => {
  return request(app).post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title, price,
    });
};

it('fetches a list of tickets', async () => {
  await createTicket('tix1', 10);
  await createTicket('tix2', 100);
  await createTicket('tix3', 100);

  const resp = await request(app).get('/api/tickets')
    .send()
    .expect(200);

  expect(resp.body.length).toEqual(3);
});