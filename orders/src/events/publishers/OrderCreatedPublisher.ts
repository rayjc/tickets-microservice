import { Publisher, OrderCreatedEvent, Subjects } from '@rayjc-dev/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}