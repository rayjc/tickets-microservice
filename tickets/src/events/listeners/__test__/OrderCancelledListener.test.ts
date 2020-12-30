import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@rayjc-dev/common';
import { OrderCancelledListener } from '../OrderCancelledListener';
import { natsWrapper } from '../../../NatsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create ticket
  const ticket = Ticket.make({
    title: 'test-title',
    price: 100,
    userId: 'test-user'
  });
  const orderId = mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  // create mock event data
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg, orderId };
};

it('updates ticket', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('publishes an event', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});