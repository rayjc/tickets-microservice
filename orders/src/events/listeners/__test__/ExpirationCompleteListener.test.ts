import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@rayjc-dev/common';
import { ExpirationCompleteListener } from '../ExpirationCompleteListener';
import { natsWrapper } from '../../../NatsWrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // create a listener instance
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.make({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test-title',
    price: 10
  });
  await ticket.save();

  const order = Order.make({
    status: OrderStatus.Created,
    userId: 'some-user',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // create a mock message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, data, msg };
};


it('updates order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  // manually invoke onMessage
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  // manually invoke onMessage
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventDate = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventDate.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // manually invoke onMessage
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
