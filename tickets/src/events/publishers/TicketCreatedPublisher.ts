import { Publisher, Subjects, TicketCreatedEvent } from '@rayjc-dev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}