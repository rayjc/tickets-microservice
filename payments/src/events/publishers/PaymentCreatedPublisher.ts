import { PaymentCreatedEvent, Publisher, Subjects } from '@rayjc-dev/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}