import { Publisher, OrderCancelledEvent, Subjects } from '@rayjc-dev/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}