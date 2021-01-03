import { Subjects, Publisher, ExpirationCompleteEvent } from '@rayjc-dev/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}