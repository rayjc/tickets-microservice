import { Publisher, Subjects, TicketUpdatedEvent } from '@rayjc-dev/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}