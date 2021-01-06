import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@rayjc-dev/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../config';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    // check if order has been paid/complete
    if (order.status == OrderStatus.Complete) {
      return msg.ack();
    }

    // order not complete, mark it as expired/cancelled
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}