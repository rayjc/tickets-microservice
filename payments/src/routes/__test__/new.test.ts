import { OrderStatus } from '@rayjc-dev/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { signin } from '../../test/helpers';
import { stripe } from '../../stripe';

it('returns 404 when purchasing an unavailable order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'some-token',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns 401 when purchase an order that does not belong to user', async () => {
  const order = Order.make({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'some-token',
      orderId: order.id
    })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.make({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      orderId: order.id,
      token: 'some-token',
    })
    .expect(400);
});

it('returns a 201 and charge/payment has been made given valid input', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 1000);
  const order = Order.make({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  // send request to stripe to check charges made
  // default to most recent 10 charges,
  // increase limit if more than 10 copies are being tested
  const stripeCharges = await stripe.charges.list();
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });

  expect(payment).not.toBeNull();
});