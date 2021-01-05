import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@rayjc-dev/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../config";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}