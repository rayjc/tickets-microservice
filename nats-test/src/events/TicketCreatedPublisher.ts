import { Publisher } from './Publisher';
import { TicketCreatedEvent } from './TicketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // final immutable type of Subjects
  readonly subject = Subjects.TicketCreated;
}