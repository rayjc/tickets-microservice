import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@rayjc-dev/common';
import { TicketCreatedListener } from '../TicketCreatedListener';
import { natsWrapper } from '../../../NatsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener instance
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create an event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test-title',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a mock message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};


it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // manually invoke onMessage
  await listener.onMessage(data, msg);

  // make sure ticket is created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // manually invoke onMessage
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
