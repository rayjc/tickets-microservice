import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@rayjc-dev/common';
import { QUEUE_GROUP_NAME } from '../../config';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find the ticket reserved by order
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket as reserved by setting orderId
    // setting undefined instead of null due to typescript type check...
    ticket.set({ orderId: undefined });

    // save ticket
    await ticket.save();
    // publish update event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack message
    msg.ack();
  }
}
