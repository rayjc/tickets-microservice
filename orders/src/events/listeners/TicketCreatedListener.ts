import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@rayjc-dev/common';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from '../../config';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.make({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}